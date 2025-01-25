import { AudioDocument } from "@models/audio";
import { ObjectId } from "mongoose";

export type populatedFavList = AudioDocument<{ _id: ObjectId; name: string }>[];

import { Request } from "express";

export interface CreatePlaylistBody {
  title: string;
  resId: string;
  visibility: "public" | "Private";
}

export interface UpdatePlaylistBody {
  title: string;
  item: string;
  id: string;
  visibility: "public" | "Private";
}

export interface CreatePlaylistRequest extends Request {
  body: CreatePlaylistBody;
}

export interface UpdatePlaylistRequest extends Request {
  body: UpdatePlaylistBody;
}
