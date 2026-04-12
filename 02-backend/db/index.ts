import { drizzle } from "drizzle-orm/node-postgres";
import relations from "./relations";

const db = drizzle(process.env.DB_URL!, { relations });

export default db;
