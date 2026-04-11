import {
  FaFile,
  FaFileAlt,
  FaFilePdf,
  FaFilm,
  FaImage,
  FaVolumeUp,
} from "react-icons/fa";
import { match } from "ts-pattern";

export default function FileIcon({ mimeType }: { mimeType: string }) {
  return match(mimeType)
    .when(
      (mimeType) => mimeType === "application/pdf",
      () => <FaFilePdf className="text-danger" />,
    )
    .when(
      (mimeType) => mimeType.startsWith("image"),
      () => <FaImage className="text-info" />,
    )
    .when(
      (mimeType) => mimeType.startsWith("audio"),
      () => <FaVolumeUp className="text-success" />,
    )
    .when(
      (mimeType) => mimeType.startsWith("video"),
      () => <FaFilm className="text-warning" />,
    )
    .when(
      (mimeType) => mimeType.startsWith("text"),
      () => <FaFileAlt className="text-secondary" />,
    )
    .otherwise(() => <FaFile />);
}
