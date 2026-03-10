import express from "express";
import "dotenv/config";
import AuthRouter from "./routes/auth.js";

const app = express();

app.use(express.json());
app.use('/api/v1/auth',AuthRouter);

export default app;