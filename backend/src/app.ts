import express from "express";
import "dotenv/config";
import AuthRouter from "./routes/auth.js";
import NotesRouter from "./routes/notes.js";

const app = express();

app.use(express.json());
app.use('/api/v1/auth',AuthRouter);
app.use('/api/v1/notes',NotesRouter);

export default app;