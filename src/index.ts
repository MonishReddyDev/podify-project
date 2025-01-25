import express from "express";
import "dotenv/config";
import "./db";
import authrouter from "./routers/auth";
import { PORT } from "@utils/variables";
import morgan from "morgan";
import audioRouter from "../src/routers/audio";
import favoriteRouter from "../src/routers/favorite";
import PlayListRouter from "../src/routers/playlist";

const app = express();

//register our middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static("src/public"));

//routers
app.use("/auth", authrouter);
app.use("/audio", audioRouter);
app.use("/favorite", favoriteRouter);
app.use("/playlist", PlayListRouter);

//Port
const PORTN = PORT || 8082;

//listener
app.listen(PORTN, () => {
  console.log("server running on port", PORTN);
});

export default app;
