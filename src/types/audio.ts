import { AudioDocument } from "@models/audio";
import { ObjectId } from "mongoose";

export type populatedFavList = AudioDocument<{ _id: ObjectId; name: string }>[];
