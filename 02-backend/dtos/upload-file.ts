import * as v from "valibot";

const UploadFileDto = v.object({
  file: v.pipe(v.file()),
  folderId: v.optional(v.pipe(v.string(), v.toNumber(), v.integer())),
});

export default UploadFileDto;
