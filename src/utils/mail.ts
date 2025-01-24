import nodemailer from "nodemailer";

import {
  MAILTRAP_PASS,
  MAILTRAP_USER,
  PASSWORD_RESET_LINK,
  SIGN_IN_URL,
  VERIFICATION_EMAIL,
} from "@utils/variables";

import { generateTemplate } from "src/mail/template";
import path from "path";

const generateMailTransporter = () => {
  //send verification Email
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASS,
    },
  });
  return transport;
};


interface Profile {
  name: string;
  email: string;
  userId: string;
}

export const sendverificationMail = async (token: string, profile: Profile) => {
  const transport = generateMailTransporter();

  const { name, email, userId } = profile;
  const message = `Hi ${name} welcome to podify! Use the given OTP to verify the user`;

  transport.sendMail({
    subject: "welcome message",
    to: email,
    from: VERIFICATION_EMAIL,
    html: generateTemplate({
      title: "Welcome to podify",
      message: message,
      logo: "cid:logo",
      banner: "cid:welcome",
      link: "#",
      btnTitle: token,
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "welcome.png",
        path: path.join(__dirname, "../mail/welcome.png"),
        cid: "welcome",
      },
    ],
  });
};

interface Options {
  email: string;
  link: string;
}

export const sendForgetPasswordLink = async (options: Options) => {
  const transport = generateMailTransporter();

  const { email, link } = options;
  const message =
    "we  just recived a request that you forget your password.No problem. you can use the link below to create a brand new password ";
  transport.sendMail({
    subject: "Reset passwors Link",
    to: email,
    from: VERIFICATION_EMAIL,
    html: generateTemplate({
      title: "Forget Password",
      message: message,
      logo: "cid:logo",
      banner: "cid:forget_password",
      link,
      btnTitle: "Reset Password",
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "forget_password.png",
        path: path.join(__dirname, "../mail/forget_password.png"),
        cid: "forget_password",
      },
    ],
  });
};


export const sendPasswordResetSuccesssEmail = async (
  name: string,
  email: string
) => {
  const transport = generateMailTransporter();

  const message = `Dear ${name} we just updated your new password.You can now sign in with your new password`;

  transport.sendMail({
    subject: "Password Reset Successfully",
    to: email,
    from: VERIFICATION_EMAIL,
    html: generateTemplate({
      title: "Password Reset Successfully",
      message,
      logo: "cid:logo",
      banner: "cid:forget_password",
      link: SIGN_IN_URL,
      btnTitle: "Login",
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "forget_password.png",
        path: path.join(__dirname, "../mail/forget_password.png"),
        cid: "forget_password",
      },
    ],
  });
};
