import mongoose from "mongoose";
import { MONGO_URI } from "../utils/variables";

const URI = MONGO_URI;

mongoose
  .connect(URI)
  .then(() => {
    console.log("Db connection successful");
  })
  .catch((err) => {
    console.log("Something WRONG while connecting DB!");
  });
