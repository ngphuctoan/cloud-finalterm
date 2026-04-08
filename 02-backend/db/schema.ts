import {
  pgTable,
  serial,
  text,
  integer,
  bigint,
  timestamp,
  foreignKey,
  primaryKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const filesTable = pgTable("files", {
  id: serial().primaryKey(),
  name: text().notNull(),
  sizeBytes: bigint("size_bytes", { mode: "number" }).notNull(),
  bucketKey: text("bucket_key").notNull(),
  folderId: integer("folder_id").references(() => foldersTable.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const foldersTable = pgTable(
  "folders",
  {
    id: serial().primaryKey(),
    name: text().notNull(),
    parentId: integer("parent_id"),
    createdAt: timestamp("created_at").default(sql`now()`),
  },
  (table) => [
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
      name: "folders_parent_id_fkey",
    }).onDelete("cascade"),
  ],
);
