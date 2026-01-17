import express from "express";
import cors from "cors";

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

app.listen(3000, () => {
  console.log("listening on port: ", 3000);
});
