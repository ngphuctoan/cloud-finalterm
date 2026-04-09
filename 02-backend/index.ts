import express from "express";
import cors from "cors";
import v1Router from "./routes/v1";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/v1", v1Router);

const PORT = 3000;
app.listen(PORT, async () => {
  console.log(`Example app listening on port ${PORT}`);
});
