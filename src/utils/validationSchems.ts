import { isValidObjectId } from "mongoose";
import * as yup from "yup";
import { categories } from "./audio_category";

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const CreateUserSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters long")
    .max(20, "Name is too Long"),

  email: yup
    .string()
    .email("Invalid email format")
    .matches(
      /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
      "Only Gmail addresses are allowed"
    )
    .required("Email is required"),

  password: yup
    .string()
    .trim()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long")
    .matches(
      passwordPattern,
      "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a digit, and a special character"
    ),
});

export const tokenAndIdValidation = yup.object().shape({
  token: yup.string().trim().required("Invalid Token!"),
  userId: yup
    .string()
    //custom validation value comming from frontend and trying to find is this the valid value or not
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }
      return "";
    })
    .required("Invalid UserId"),
});

export const updatePasswordValidation = yup.object().shape({
  token: yup.string().trim().required("Invalid Token!"),
  userId: yup
    .string()
    //custom validation value comming from frontend and trying to find is this the valid value or not
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }
      return "";
    })
    .required("Invalid UserId"),
  password: yup
    .string()
    .trim()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long")
    .matches(
      passwordPattern,
      "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a digit, and a special character"
    ),
});

export const SignInValidationSchema = yup.object().shape({
  email: yup.string().email("Invalid email ID").required("Email is Missing!"),
  password: yup.string().trim().required("Password is required"),
});

export const AudioValidationSchema = yup.object().shape({
  title: yup.string().required("Title is missing!"),
  about: yup.string().required("About is missing!"),
  category: yup
    .string()
    .oneOf(categories, "Invalid Category")
    .required("Category is missing!"),
});

export const NewPlaylistValidationSchema = yup.object().shape({
  title: yup.string().required("Title is missing!"),
  resId: yup.string().transform(function (value) {
    return this.isType(value) && isValidObjectId(value) ? value : ""; //if we have the valid value we return that valuse else return empty string
  }),
  visibility: yup
    .string()
    .oneOf(["public", "private"], "Visibility must be public or private!")
    .required("Visibility is missing!"),
});

export const OldPlaylistValidationSchema = yup.object().shape({
  title: yup.string().required("Title is missing!"),
  //this is going to validate the audio id
  item: yup.string().transform(function (value) {
    return this.isType(value) && isValidObjectId(value) ? value : ""; //if we have the valid value we return that valuse else return empty string
  }),
  //this is going to validate the playlist id
  id: yup.string().transform(function (value) {
    return this.isType(value) && isValidObjectId(value) ? value : ""; //if we have the valid value we return that valuse else return empty string
  }),
  visibility: yup
    .string()
    .oneOf(["public", "private"], "Visibility must be public or private!"),
  // .required("Visibility is missing!"),
});
