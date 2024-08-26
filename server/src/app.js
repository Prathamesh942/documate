import express from "express";
import authRouter from "./routes/auth.routes.js";
import docRouter from "./routes/document.routes.js";
import userRouter from "./routes/user.routes.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(cookieParser());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  //join to room with document id
  socket.on("joinRoom", (data) => {
    console.log(`${data.username} joined room: ${data.roomId}`);
    socket.join(data.roomId);
    socket
      .to(data.roomId)
      .emit("message", `${data.username} has joined the room`);
  });

  //document update
  socket.on("document-update", (data) => {
    socket.to(data.roomId).emit("document-update", { content: data.content });
    // console.log(data.content);
  });

  //cursor update
  socket.on("cursor-update", (data) => {
    socket.to(data.roomId).emit("cursor-update", { cursor: data.cursor });
    // console.log(data.cursor);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/doc", docRouter);
app.use("/api/v1/user", userRouter);

export { server };
