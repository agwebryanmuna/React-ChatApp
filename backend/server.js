import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDb } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

// create express app and http server
const app = express();
const server = http.createServer(app); // http supported by socket.io

// inintialize socket.io server
export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  },
});

// store online users
export const userSocketMap = {}; // {userId: socketId}

// socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  console.log("New socket connection:", userId, socket.id);

  if (userId) userSocketMap[userId] = socket.id;

  // Emit online users to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // handle user disconnect
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", userId);
    delete userSocketMap[userId];

    // Emit updated online users to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// middleware setup
app.use(express.json({ limit: "1mb" }));
app.use(cors());

// connect to database
await connectDb();

// routes setup
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);
app.use("/api/status", (_, res) => res.send("Server is live 😘"));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Server is running on PORT:" + PORT));
