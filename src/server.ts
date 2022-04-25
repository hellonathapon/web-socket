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
        methods: ["GET", "POST"]
    }
});

app.get("/", (req: Request, res: Response) => {
    return res.sendFile(path.resolve("./public/index.html"))
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.broadcast.emit('connection', { text: "A user has joined the chat", timeStamp: new Date(), owner: false, type: 'notify' })
    //io.sockets.emit("broadcast", {text: "A user has joined the chat", timeStamp: new Date(), owner: false})
    socket.on('disconnect', () => {
	console.log('A user disconnected')
	socket.broadcast.emit('disconnection', { text: 'A user disconnected!', timeStamp: new Date(), owner: false, type: 'notify' })
    })
    socket.on('chat message', (message) => {
	socket.emit('chat message', {text: message, timeStamp: new Date(), owner: true, type: 'message'}) // send back to sender
	socket.broadcast.emit('chat message', { text: message, timeStamp: new Date(), owner: false, type: 'message' })
	//io.emit('chat message', message); // send back to everyone
    })
});

app.use(express.static(path.join(__dirname, "../public")));

server.listen(5000, () => console.log(`⚡️Server is running at http://localhost:${port}`));
