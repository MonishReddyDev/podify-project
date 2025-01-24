import { RequestHandler } from "express";
import User from "@models/user";
import { CreateUser, verifyEmailRequest } from "src/types/user";
import { formatProfile, generateToken } from "@utils/helper";
import jwt from "jsonwebtoken";
import {
  sendForgetPasswordLink,
  sendPasswordResetSuccesssEmail,
  sendverificationMail,
} from "@utils/mail";
import emailVerificationTokens from "@models/emailVerificationTokens";
import { isValidObjectId } from "mongoose";
import user from "@models/user";
import passwordResetTokens from "@models/passwordResetTokens";
import crypto from "crypto";
import { AWS_BUCKET, JWt_SECRET, PASSWORD_RESET_LINK } from "@utils/variables";
import { RequestWithFiles } from "src/middleware/fileparser";
import { s3 } from "@utils/cloud/awsServices";
import { uploadToS3 } from "@utils/cloud/awsHelper";

export const create: RequestHandler = async (req: CreateUser, res) => {
  try {
    const { name, email, password } = req.body;

    //user created in the database
    const newUser = await User.create({ name, email, password });

    //generating 6 digit OTP
    const token = generateToken();
    emailVerificationTokens.create({
      owner: newUser._id,
      token,
    });

    //send verifiCATION TOKEN
    sendverificationMail(token, { name, email, userId: newUser.id.toString() });

    res.status(201).json({ newUser: { id: newUser.id, name, email } });
  } catch (err: any) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    } else if (err.code === 11000) {
      return res.status(409).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
};

export const verifyEmail: RequestHandler = async (
  request: verifyEmailRequest,
  response
) => {
  try {
    const { token, userId } = request.body;

    const verificationToken = await emailVerificationTokens.findOne({
      owner: userId,
    });

    if (!verificationToken)
      return response.status(403).json({ error: "invalid Token!" });

    const matched = await verificationToken.compareToken(token);

    if (!matched) return response.status(403).json({ error: "invalid Token!" });

    await User.findByIdAndUpdate(userId, {
      verified: true,
    });

    await emailVerificationTokens.findByIdAndDelete(verificationToken._id);

    response.json({ message: "Your email is verified" });
  } catch (err: any) {
    response.status(500).json({ error: "Server error" });
  }
};

export const sendReverificationToken: RequestHandler = async (
  request: verifyEmailRequest,
  response
) => {
  try {
    const { userId } = request.body;

    if (!isValidObjectId(userId))
      return response.status(403).json({ error: "Invalid request" });

    const user = await User.findById(userId);

    if (!user) return response.status(403).json({ error: "Invalid request" });

    await emailVerificationTokens.findOneAndDelete({
      owner: userId,
    });

    const token = generateToken();

    emailVerificationTokens.create({
      owner: userId,
      token,
    });

    sendverificationMail(token, {
      name: user?.name,
      email: user?.email,
      userId: user?.id.toString(),
    });

    response.json({ message: "Please check your mail." });
  } catch (err: any) {
    response.status(500).json({ error: "Server error" });
  }
};

export const generateForgetPasswordLink: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

    const User = await user.findOne({ email });

    if (!User) return res.status(404).json({ error: "Account not found!" });

    //delete if any token exist in DB
    await passwordResetTokens.findOneAndDelete({ owner: User._id });

    //get random token
    const token = crypto.randomBytes(36).toString("hex");

    //Save the token in db
    await passwordResetTokens.create({
      owner: User._id,
      token,
    });

    const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${User._id}`;

    sendForgetPasswordLink({ email: User.email, link: resetLink });

    res.json({ message: "Check your registered Email" });

    //generate the link
  } catch (err: any) {
    res.status(500).json({ error: "Server error" });
  }
};

export const grantValid: RequestHandler = async (req, res) => {
  res.json({ valid: true });
};

export const updatePassword: RequestHandler = async (req, res) => {
  const { password, userId } = req.body;

  const User = await user.findById(userId);

  if (!User) return res.status(403).json({ error: "Unauthorized access!" });

  const matched = await User.comparePassword(password);
  if (matched)
    return res
      .status(422)
      .json({ error: "The new password must be different!" });

  User.password = password;

  await User.save();

  await passwordResetTokens.findOneAndDelete({ owner: User._id });

  //send the success passoword chnaged email
  sendPasswordResetSuccesssEmail(User.name, User.email);

  res.json({ message: "Password reset Successfull" });
};

export const signIn: RequestHandler = async (req, res) => {
  const { password, email } = req.body;

  const User = await user.findOne({ email });

  if (!User) return res.status(403).json({ error: "Email/Password mismatch!" });

  //compare the password
  const matched = await User.comparePassword(password);
  if (!matched)
    return res.status(403).json({ error: "Email/Password mismatch!" });

  //generate the token for later use
  const token = jwt.sign({ userId: User._id }, JWt_SECRET);

  User.tokens.push(token);

  await User.save();
  res.json({
    profile: {
      id: User._id,
      name: User.name,
      email: User.email,
      verified: User.verified,
      avatar: User.avatar?.url,
      followers: User.followers.length,
      following: User.following.length,
    },
    token,
  });
};

export const sendProfile: RequestHandler = async (req, res) => {
  try {
    res.status(200).json({ profile: req.user });
  } catch (error) {
    res.status(401).json({ profile: "Unauthorized" });
  }
};

export const uploadProfile: RequestHandler = async (
  req: RequestWithFiles,
  res
) => {
  try {
    const { name } = req.body;
    const avatar = req.files?.avatar;

    if (!avatar) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const user = await User.findById(req.user?.profile.id);

    if (!user) throw new Error("Somethin is wrong,User not found");

    user.name = name;

    const profileFileupload = await uploadToS3(
      avatar,
      "ProfilePictures",
      user.avatar?.url
    );

    user.avatar = { url: profileFileupload.Location };

    await user.save();

    // Send response
    res.status(200).json({
      message: "Profile uploaded successfully",
      profile: formatProfile(user),
    });
  } catch (error) {
    console.error("Error uploading profile:", error);
    res.status(500).json({ error: "Failed to upload profile" });
  }
};

export const logout: RequestHandler = async (req, res) => {
  const { fromAll } = req.query;

  const token = req.user?.token;

  const user = await User.findById(req.user?.profile.id);

  if (!user) throw new Error("Somethin is wrong,User not found");

  //logout form all devices
  if (fromAll === "yes") user.tokens = [];
  else user.tokens = user.tokens.filter((t) => t !== token);

  await user.save();

  res.json({ Success: true });
};
