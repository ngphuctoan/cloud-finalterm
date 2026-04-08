import * as v from "valibot";

const CreateFolderDto = v.object({
  name: v.pipe(v.string(), v.nonEmpty(), v.regex(/^[a-zA-Z0-9._-]+$/)),
  parentId: v.nullable(v.pipe(v.number(), v.integer())),
});

export default CreateFolderDto;
