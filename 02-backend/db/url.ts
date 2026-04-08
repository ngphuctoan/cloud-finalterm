import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const getPostgresUrl = () => {
  return `postgres://postgres:${process.env.DB_PASS}@localhost:5432/postgres`;
};

export default getPostgresUrl;
