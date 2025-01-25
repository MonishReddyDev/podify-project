import { Model, model, models, ObjectId, Schema } from "mongoose";

interface PlayListDocument {
  title: String;
  owner: ObjectId;
  items: ObjectId[];
  visibility: "Public" | "Private" | "Auto";
}

const PlayListSchema = new Schema<PlayListDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    owner: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    items: [
      {
        required: true,
        type: Schema.Types.ObjectId,
        ref: "Audio",
      },
    ],
    visibility: {
      type: String,
      enum: ["public", "private", "Auto"],
      default: "Public",
    },
  },
  {
    timestamps: true,
  }
);

const PlayList = models.PlayList || model("PlayList", PlayListSchema);

export default PlayList as Model<PlayListDocument>;
