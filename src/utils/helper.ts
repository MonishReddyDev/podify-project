import { UserDocument } from "@models/user";

export const generateToken = (length = 6) => {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
};

export const formatProfile = (user: UserDocument) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    verified: user.verified,
    avatar: user.avatar?.url,
    followers: user.followers.length,
    following: user.following.length,
  };
};
