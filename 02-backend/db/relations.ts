import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

const relations = defineRelations(schema, (r) => ({
  filesTable: {
    folder: r.one.foldersTable({
      from: r.filesTable.folderId,
      to: r.foldersTable.id,
    }),
  },
  foldersTable: {
    filesTable: r.many.filesTable(),
    folder: r.one.foldersTable({
      from: r.foldersTable.parentId,
      to: r.foldersTable.id,
      alias: "folders_parentId_folders_id",
    }),
    foldersTable: r.many.foldersTable({
      alias: "folders_parentId_folders_id",
    }),
  },
}));

export default relations;
