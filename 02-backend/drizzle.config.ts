import { defineConfig } from "drizzle-kit";
import getPostgresUrl from "./db/url";

export default defineConfig({
  out: "./drizzle",
  schema: "./db/schema.ts",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: getPostgresUrl(),
  },
});
