import { Image } from "react-bootstrap";
import { FaQuestionCircle } from "react-icons/fa";
import { match } from "ts-pattern";
import CodeMirror from "@uiw/react-codemirror";
import { useQuery } from "@tanstack/react-query";

export default function FilePreview({
  url,
  mimeType,
  ext,
}: {
  url: string;
  mimeType: string;
  ext?: string;
}) {
  const { data } = useQuery({
    queryKey: [url],
    queryFn: () => fetch(url).then((res) => res.text()),
    enabled: mimeType.startsWith("text"),
  });

  return match([mimeType, ext])
    .when(
      ([mimeType]) => mimeType.startsWith("text"),
      () => (
        <CodeMirror
          value={data || ""}
          editable={false}
          className="w-100"
          height="450px"
        />
      ),
    )
    .when(
      ([mimeType]) => mimeType === "application/pdf",
      () => <iframe src={url} width="100%" height={450} />,
    )
    .when(
      ([mimeType]) => mimeType.startsWith("image"),
      () => <Image src={url} fluid />,
    )
    .when(
      ([mimeType]) => mimeType.startsWith("audio"),
      () => <audio src={url} controls className="w-50" />,
    )
    .when(
      ([mimeType]) => mimeType.startsWith("video"),
      () => <video src={url} controls width="100%" />,
    )
    .otherwise(() => (
      <>
        <FaQuestionCircle size={64} className="text-body-tertiary my-2" />
        <p className="lead text-body-tertiary my-2">
          Không hỗ trợ xem trước cho tệp tin này
        </p>
      </>
    ));
}
