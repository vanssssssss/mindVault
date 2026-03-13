import express from "express";
import cors from "cors";
import "dotenv/config";
import AuthRouter from "./routes/auth.js";
import NotesRouter from "./routes/notes.js";
import TagsRouter from "./routes/tags.js";

const app = express();
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());


app.use('/api/v1/auth',AuthRouter);
app.use('/api/v1/notes',NotesRouter);
app.use('/api/v1/tags',TagsRouter);

export default app;