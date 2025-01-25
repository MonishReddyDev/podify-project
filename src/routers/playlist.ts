import {
  NewPlaylistValidationSchema,
  OldPlaylistValidationSchema,
} from "@utils/validationSchems";
import { Router } from "express";
import {
  createPlaylist,
  getAudios,
  getPlaylistByProfile,
  removePlaylist,
  updatePlaylist,
} from "src/controller/playlist";
import { isVerified } from "src/middleware/audio";
import { mustAuth } from "src/middleware/auth";
import { validate } from "src/middleware/validator";

const router = Router();

router.post(
  "/create",
  mustAuth,
  isVerified,
  validate(NewPlaylistValidationSchema),
  createPlaylist
);

router.patch(
  "/",
  mustAuth,
  validate(OldPlaylistValidationSchema),
  updatePlaylist
);

router.delete("/", mustAuth, removePlaylist);

router.get("/by-profile", mustAuth, getPlaylistByProfile);

router.get("/:playListId", mustAuth, getAudios);

export default router;
