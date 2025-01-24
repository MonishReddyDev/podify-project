import { Router } from "express";
import {
  getFavorites,
  getIsFavorite,
  togglefavorite,
} from "src/controller/favorite";
import { isVerified } from "src/middleware/audio";
import { mustAuth } from "src/middleware/auth";

const router = Router();

router.post("/", mustAuth, isVerified, togglefavorite);
router.get("/", mustAuth, getFavorites);
router.get("/is-fav", mustAuth, getIsFavorite);

export default router;
