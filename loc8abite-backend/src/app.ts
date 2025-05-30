import express from "express";
import cors from "cors";
import scoreRoutes from "./routes/scores";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/scores", scoreRoutes);

export default app;
