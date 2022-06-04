import path from "path";
import express, { Application, Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app: Application = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io: Server = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req: Request, res: Response) => {
  return res.sendFile(path.resolve("./public/index.html"));
});

io.on("connection", (socket) => {
  // Retrieve insensitive data from the url
  var username = socket.handshake.query.user;
  socket.broadcast.emit("connection", {
    text: `${username} has joined the chat`,
    timeStamp: new Date(),
    owner: false,
    type: "notify",
  });
  // socket.broadcast.emit('connection', { text: "A user has joined the chat", timeStamp: new Date(), owner: false, type: 'notify' })
  socket.on("disconnect", () => {
    socket.broadcast.emit("disconnection", {
      text: `${username} disconnected!`,
      timeStamp: new Date(),
      owner: false,
      type: "notify",
    });
  });
  socket.on("chat message", (chatData) => {
    console.log(chatData);
    socket.emit("chat message", {
      text: chatData.message,
      timeStamp: new Date(),
      owner: true,
      ownerName: chatData.owner,
      type: "message",
    }); // send back to sender
    socket.broadcast.emit("chat message", {
      text: chatData.message,
      timeStamp: new Date(),
      owner: false,
      ownerName: chatData.owner,
      type: "message",
    });
    //io.emit('chat message', message); // send back to everyone
  });
});

app.use(express.static(path.join(__dirname, "../public")));

server.listen(5000, () =>
  console.log(`⚡️Server is running at http://localhost:${port}`)
);
