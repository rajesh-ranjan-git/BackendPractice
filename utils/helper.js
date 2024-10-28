import { supportedMimes } from "../config/fileSystem.js";
import { v4 as uuid4 } from "uuid";

export const imageValidator = (size, mime) => {
  if (bytesToMB(size) > 2) {
    return "Image size must be less than 2 MB.";
  } else if (!supportedMimes.includes(mime)) {
    return "Image must be type of png, jpg, jpeg, gif, webp, svg only.";
  }

  return null;
};

export const bytesToMB = (bytes) => {
  return bytes / (1024 * 1024);
};

export const generateRandomNumber = () => {
  return uuid4();
};

export const getImageUrl = (imgName) => {
  return `${process.env.APP_URL}/images/${imgName}`;
};
