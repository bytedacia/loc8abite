import express from "express";
import cors from "cors";
import wikidataRoute from "./routes/wikidata";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/wikidata", wikidataRoute);

export default app;
