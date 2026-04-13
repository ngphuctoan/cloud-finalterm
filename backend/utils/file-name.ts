import { INVALID_NAME_CHARS_REGEX } from "./constants";

const normalizeFileName = (fileName: string) => {
  return fileName.trim().replace(INVALID_NAME_CHARS_REGEX, "");
};

export default normalizeFileName;
