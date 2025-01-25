import Audio from "@models/audio";
import PlayList from "@models/playlist";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import {
  CreatePlaylistRequest,
  populatedFavList,
  UpdatePlaylistRequest,
} from "src/types/audio";

export const createPlaylist: RequestHandler = async (
  req: CreatePlaylistRequest,
  res
) => {
  const { visibility, title, resId } = req.body;

  const ownerId = req.user?.profile.id;

  //while creating the playlist there can be Request

  if (resId) {
    const audio = await Audio.findById(resId);
    if (!audio) {
      return res.status(404).json({ error: "Could not found the audio" });
    }
  }

  const newPlaylist = new PlayList({
    title,
    owner: ownerId,
    visibility,
  });

  if (resId) newPlaylist.items = [resId as any];

  await newPlaylist.save();

  res.status(201).json({
    PlayList: {
      id: newPlaylist.id,
      title: newPlaylist.title,
      visibility: newPlaylist.visibility,
    },
  });
};

export const updatePlaylist: RequestHandler = async (
  req: UpdatePlaylistRequest,
  res
) => {
  const { id, item, visibility, title } = req.body;

  const playList = await PlayList.findOneAndUpdate(
    { _id: id, owner: req.user?.profile.id },
    { title, visibility },
    { new: true }
  );

  if (!playList) {
    // If the playlist is not found, return a 404
    return res.status(404).json({ message: "Playlist not found" });
  }

  if (item) {
    const audio = await Audio.findById(item);
    if (!audio) return res.status(404).json({ message: "audio not found" });
    // playList.items.push(audio._id);
    // await playList.save();
    await PlayList.findByIdAndUpdate(playList._id, {
      $addToSet: { items: item },
    });
  }

  res.status(201).json({
    playList: {
      id: playList.id,
      title: playList.title,
      visibility: playList.visibility,
    },
  });
};

export const removePlaylist: RequestHandler = async (req, res) => {
  const { playListId, resId, all } = req.query;

  // ("/playList?playListId=wdwqda&redId=sdqwda&all=yes");

  if (!isValidObjectId(playListId))
    return res.status(422).json({ error: "Invalid Playlist ID" });

  if (all === "yes") {
    const playlist = await PlayList.findOneAndDelete({
      _id: playListId,
      owner: req.user?.profile.id,
    });
    if (!playlist) return res.status(404).json({ error: "Playlist not found" });
  }

  if (resId) {
    if (!isValidObjectId(resId))
      return res.status(422).json({ error: "Invalid audio id!" });
    //update and remove
    const playlist = await PlayList.findOneAndUpdate(
      {
        _id: playListId,
        owner: req.user?.profile.id,
      },
      {
        $pull: { items: resId },
      }
    );

    if (!playlist) return res.status(404).json({ error: "Playlist not found" });
  }

  res.status(200).json({ Success: true });
};

export const getPlaylistByProfile: RequestHandler = async (req, res) => {
  const { pageNo = "0", limit = "20" } = req.query as {
    pageNo: string;
    limit: string;
  };
  const data = await PlayList.find({
    owner: req.user?.profile.id,
    visibility: { $ne: "auto" }, //visibility not equal to auto
  })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit))
    .sort("-createdAt");

  const playlist = data.map((item) => {
    return {
      _id: item.id,
      title: item.title,
      itemsCount: item.items.length,
      visibility: item.visibility,
    };
  });
  res.status(200).json({ playlist });
};

//the types for response is any try to chnange it
export const getAudios: RequestHandler = async (req, res) => {
  const { playListId } = req.params;

  if (!isValidObjectId(playListId))
    return res.status(404).json({ error: "Invalid PlaylistId" });

  const playlist = await PlayList.findOne({
    _id: playListId,
    owner: req.user?.profile.id,
  }).populate<{ items: populatedFavList[any] }>({
    path: "items",
    populate: {
      path: "owner",
      select: "name",
    },
  });

  if (!playlist) return res.json({ list: [] });

  const audios = playlist.items.map((item: any) => {
    return {
      id: item._id,
      title: item.title,
      category: item.category,
      file: item.file.url,
      poster: item.poster?.url,
      owner: { name: item.owner.name, id: item.owner._id },
    };
  });

  res.json({
    list: {
      id: playlist._id,
      title: playlist.title,
      audios,
    },
  });
};
