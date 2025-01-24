import Audio from "@models/audio";
import { categoriesTypes } from "@utils/audio_category";
import { uploadToS3 } from "@utils/cloud/awsHelper";
import { RequestHandler } from "express";
import formidable from "formidable";
import { RequestWithFiles } from "src/middleware/fileparser";

interface CreateAudioRequest extends RequestWithFiles {
  body: {
    title: string;
    about: string;
    category: categoriesTypes;
  };
}

export const createAudio: RequestHandler = async (
  req: CreateAudioRequest,
  res
) => {
  const { title, about, category } = req.body;
  const poster = req.files?.poster as formidable.File;
  const audioFile = req.files?.file as formidable.File;
  const ownerId = req.user?.profile.id;

  if (!audioFile)
    return res.status(422).json({ error: "Audio file is missing!" });

  const audioFileupload = await uploadToS3(audioFile, "AudioFiles");

  const newAudio = new Audio({
    title,
    about,
    category,
    owner: ownerId,
    file: { url: audioFileupload.Location },
  });

  if (poster) {
    const posterfileUpload = await uploadToS3(poster, "PosterFiles");

    newAudio.poster = {
      url: posterfileUpload.Location,
    };
  }
  await newAudio.save();

  res.status(201).json({
    audio: {
      title,
      about,
      file: newAudio.file.url,
      poster: newAudio.poster?.url,
    },
  });
};

export const updateAudio: RequestHandler = async (
  req: CreateAudioRequest,
  res
) => {
  const { title, about, category } = req.body;
  const poster = req.files?.poster as formidable.File;
  const ownerId = req.user?.profile.id;
  const { audioId } = req.params;

  const audio = await Audio.findOneAndUpdate(
    { owner: ownerId, _id: audioId },
    { title, about, category },
    { new: true }
  );

  if (!audio) return res.status(404).json({ error: "Audio not found!" });

  //If the poster exist
  if (poster) {
    //if we have already a poster delete the existing poster and upload the new poster
    if (audio.poster?.url) {
      const posterfileUpload = await uploadToS3(
        poster,
        "PosterFiles",
        audio.poster?.url
      );
      audio.poster = {
        url: posterfileUpload.Location,
      };
      //save the update
      await audio.save();
    }
  }

  res.status(201).json({
    audio: {
      title,
      about,
      file: audio.file.url,
      poster: audio.poster?.url,
    },
  });
};
