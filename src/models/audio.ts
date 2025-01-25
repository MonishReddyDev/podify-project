import { categories, categoriesTypes } from "@utils/audio_category";
import { Model, model, models, ObjectId, Schema } from "mongoose";


export interface AudioDocument<T = ObjectId> {
  [x: string]: any;
  _id: ObjectId;
  title: string;
  about: string;
  owner: T;
  file: {
    url: string;
  };
  poster?: {
    url: string;
  };
  likes: ObjectId[];
  category: categoriesTypes;
}


const AudioSchema = new Schema<AudioDocument<ObjectId>>(
  {
    title: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    file: {
      type: Object,
      url: String,
      required: true,
    },
    poster: {
      type: Object,
      url: String,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    category: {
      type: String,
      enum: categories,
      default: "Others",
    },
  },
  {
    timestamps: true,
  }
);

const Audio = models.Audio || model("Audio", AudioSchema);

export default Audio as Model<AudioDocument>;
