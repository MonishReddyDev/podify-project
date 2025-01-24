import { RequestHandler } from "express";

export const isVerified: RequestHandler = async (req, res, next) => {
  if (!req.user?.profile.verified)
    return res.status(403).json({ error: "please verify your emial" });

  next();
};
