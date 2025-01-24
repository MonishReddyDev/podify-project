import { Model, ObjectId, Schema, model } from "mongoose";
import { hash, compare } from "bcrypt";

export interface passwordResetTokenDocument {
  owner: ObjectId;
  token: string;
  createdAt: Date;
}

interface Methods {
  compareToken(token: string): Promise<Boolean>;
}

const passwordResetTokenSchema = new Schema<
  passwordResetTokenDocument,
  {},
  Methods
>({
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 3600, //60 min * 60 sec == 3600s
    default: Date.now(),
  },
});

//hash the OTP token
passwordResetTokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    this.token = await hash(this.token, 10);
  }

  next();
});
//compare the token with hashed token
passwordResetTokenSchema.methods.compareToken = async function (token) {
  const result = await compare(token, this.token);
  return result;
};

export default model("passwordResetToken", passwordResetTokenSchema) as Model<
  passwordResetTokenDocument,
  {},
  Methods
>;
