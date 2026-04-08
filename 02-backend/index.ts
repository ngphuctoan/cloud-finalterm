import express from "express";
import v1Router from "./routes/v1";

const app = express();

app.use("/v1", v1Router);

const PORT = 3000;
app.listen(PORT, async () => {
  console.log(`Example app listening on port ${PORT}`);
});
