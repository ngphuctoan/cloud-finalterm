import * as v from "valibot";
import { NAME_REGEX } from "../utils/constants";

const CreateFolderDto = v.object({
  name: v.pipe(v.string(), v.nonEmpty(), v.regex(NAME_REGEX)),
  parentId: v.optional(
    v.nullable(v.pipe(v.string(), v.toNumber(), v.integer())),
  ),
});

export default CreateFolderDto;
