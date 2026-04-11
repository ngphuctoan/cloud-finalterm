import * as v from "valibot";
import { NAME_REGEX } from "../utils/constants";

const UpdateFolderDto = v.object({
  name: v.pipe(v.string(), v.nonEmpty(), v.regex(NAME_REGEX)),
});

export default UpdateFolderDto;