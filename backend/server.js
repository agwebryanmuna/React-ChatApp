import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDb } from "./config/db";
import userRouter from "./routes/userRoutes.js";

// create express app and http server
const app = express();
const server = http.createServer(app); // http supported by socket.io

// middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// connect to database
await connectDb();

// routes setup
app.use("/api/auth", userRouter);
app.use("/api/status", (_, res) => res.send("Server is live 😘"));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Server is running on PORT:" + PORT));
