import Audio, { AudioDocument } from "@models/audio";
import Favorite from "@models/favorite";
import { categories } from "@utils/audio_category";
import { RequestHandler } from "express";
import { isValidObjectId, ObjectId } from "mongoose";
import { populatedFavList } from "src/types/audio";

export const togglefavorite: RequestHandler = async (req, res) => {
  const audioId = req.query.audioId as string;
  let status: "removed" | "added";

  if (!isValidObjectId(audioId))
    return res.status(422).json({ error: "Audio id is invalid!" });

  const audio = await Audio.findById(audioId);

  if (!audio) return res.status(404).json({ error: "Audi not found" });

  //audio is already in favorite
  const alreadyExist = await Favorite.findOne({
    owner: req.user?.profile.id,
    items: audioId,
  });

  if (alreadyExist) {
    //we want to remove form old list
    await Favorite.updateOne(
      { owner: req.user?.profile.id },
      {
        $pull: { items: audioId },
      }
    );
    status = "removed";
  } else {
    const favorite = await Favorite.findOne({ owner: req.user?.profile.id });

    if (favorite) {
      //trying to add new audio to the old list
      await Favorite.updateOne(
        { owner: req.user?.profile.id },
        {
          $addToSet: { items: audioId },
        }
      );
    } else {
      //trying to create  fresh fav listen
      await Favorite.create({ owner: req.user?.profile.id, items: [audioId] });
    }

    status = "added";
  }

  if (status === "added") {
    await Audio.findByIdAndUpdate(audioId, {
      $addToSet: { likes: req.user?.profile.id },
    });
  }

  if (status === "removed") {
    await Audio.findByIdAndUpdate(audioId, {
      $pull: { likes: req.user?.profile.id },
    });
  }

  res.json({ status });
};

export const getFavorites: RequestHandler = async (req, res) => {
  const userId = req.user?.profile.id;

  const favorite = await Favorite.findOne({ owner: userId }).populate<{
    items: populatedFavList;
  }>({
    path: "items",
    populate: {
      path: "owner",
    },
  });

  if (!favorite) return res.json({ audios: [] });

  console.log(favorite);

  const audios = favorite.items.map((item) => {
    return {
      id: item._id,
      title: item.title,
      category: item.category,
      file: item.file.url,
      poster: item.poster?.url,
      owner: { name: item.owner.name, id: item.owner._id },
    };
  });

  res.json(audios);
};

export const getIsFavorite: RequestHandler = async (req, res) => {
  const audioId = req.query.audioId as string;

  if (!isValidObjectId(audioId))
    return res.status(422).json({ error: "Audio id is invalid!" });

  const favorite = await Favorite.findOne({
    owner: req.user?.profile.id,
    items: audioId,
  });

  res.json({ result: favorite ? true : false });
};
