import { AudioValidationSchema } from "@utils/validationSchems";
import { Router } from "express";
import { createAudio, updateAudio } from "src/controller/audio";
import { isVerified } from "src/middleware/audio";
import { mustAuth } from "src/middleware/auth";
import fileParser from "src/middleware/fileparser";
import { validate } from "src/middleware/validator";

const router = Router();

router.post(
  "/create",
  mustAuth,
  isVerified,
  fileParser,
  validate(AudioValidationSchema),
  createAudio
);

router.patch(
  "/:audioId",
  mustAuth,
  isVerified,
  fileParser,
  validate(AudioValidationSchema),
  updateAudio
);

export default router;
