import * as v from "valibot";

const UploadFileDto = v.object({
  folderId: v.optional(
    v.nullable(v.pipe(v.string(), v.toNumber(), v.integer())),
  ),
});

export default UploadFileDto;
