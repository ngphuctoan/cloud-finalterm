import { drizzle } from "drizzle-orm/node-postgres";
import getPostgresUrl from "./url";
import relations from "./relations";

const db = drizzle(getPostgresUrl(), { relations });

export default db;
