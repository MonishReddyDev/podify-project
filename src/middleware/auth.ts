import passwordResetTokens from "@models/passwordResetTokens";
import User from "@models/user";
import { JWt_SECRET } from "@utils/variables";
import { RequestHandler } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

export const isValidPasswordResetToken: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { token, userId } = req.body;

    //find the resetToken
    const resetToken = await passwordResetTokens.findOne({ owner: userId });

    if (!resetToken)
      return res
        .status(404)
        .json({ error: "Unauthorized access!,Invalid token" });

    const matched = await resetToken.compareToken(token);
    if (!matched)
      return res
        .status(404)
        .json({ error: "Unauthorized access!,Invalid token" });

    next();
  } catch (err: any) {
    res.status(500).json({ error: "Server error" });
  }
};

// export const mustAuth: RequestHandler = async (req, res, next) => {
//   const { authorization } = req.headers;
//   const token = authorization?.split("Bearer ")[1];

//   // Step 2: Check if the token exists
//   if (!token) {
//     return res.status(401).json({
//       error: "No token provided. Authentication required.",
//     });
//   }

//   const payload = verify(token, JWt_SECRET) as JwtPayload;

//   const id = payload.userId;

//   const user = await User.findOne({ _id: id, tokens: token });

//   if (!user) {
//     return res.status(404).json({
//       error: "User not found.",
//     });
//   }

//   req.user = {
//     profile: {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       verified: user.verified,
//       avatar: user.avatar?.url,
//       followers: user.followers.length,
//       following: user.following.length,
//     },
//     token,
//   };

//   next();
// };

export const mustAuth: RequestHandler = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization?.split("Bearer ")[1];

    // Step 2: Check if the token exists
    if (!token) {
      return res.status(401).json({
        error: "No token provided. Authentication required.",
      });
    }

    // Verify token and get payload
    const payload = verify(token, JWt_SECRET) as JwtPayload;

    const id = payload.userId;

    // Check if the user exists and token matches
    const user = await User.findOne({ _id: id, tokens: token });

    if (!user) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

    req.user = {
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        verified: user.verified,
        avatar: user.avatar?.url,
        followers: user.followers.length,
        following: user.following.length,
      },
      token,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({
      error: "Internal server error. Please try again.",
    });
  }
};
