import User from "@models/user";
import {
  CreateUserSchema,
  SignInValidationSchema,
  tokenAndIdValidation,
  updatePasswordValidation,
} from "@utils/validationSchems";
import { JWt_SECRET } from "@utils/variables";
import { error } from "console";
import { Router } from "express";
import formidable from "formidable";
import { JwtPayload, verify } from "jsonwebtoken";
import {
  create,
  generateForgetPasswordLink,
  grantValid,
  logout,
  sendProfile,
  sendReverificationToken,
  signIn,
  updatePassword,
  uploadProfile,
  verifyEmail,
} from "src/controller/user";
import { isValidPasswordResetToken, mustAuth } from "src/middleware/auth";
import { validate } from "src/middleware/validator";
import fs from "fs";
import path from "path";
import fileParser, { RequestWithFiles } from "src/middleware/fileparser";

const router = Router();

router.post("/create", validate(CreateUserSchema), create);

router.post("/Verify-email", validate(tokenAndIdValidation), verifyEmail);

router.post("/Re-Verify-email", sendReverificationToken);

router.post("/forget-password", generateForgetPasswordLink);

// Verify-password-resetToken
router.post(
  "/Verify-password-resetToken",
  validate(tokenAndIdValidation),
  isValidPasswordResetToken,
  grantValid
);
//update-password
router.post(
  "/update-password",
  validate(updatePasswordValidation),
  isValidPasswordResetToken,
  updatePassword
);

router.post("/Sign-in", validate(SignInValidationSchema), signIn);

router.post("/is-auth", mustAuth, sendProfile);

router.get("/public", (req, res) => {
  res.json({
    message: "you are in public route",
  });
});

router.get("/private", mustAuth, (req, res) => {
  res.json({
    message: "you are in Private route",
  });
});

router.post("/update-profile", mustAuth, fileParser, uploadProfile);

router.post("/log-out", mustAuth, logout);
export default router;
