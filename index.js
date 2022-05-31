import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import 'dotenv/config';

const port = process.env.PORT;

const app = express();
const server = createServer(app);
const io = new Server(server);

server.listen(port);
app.use(express.static("public"));
console.log(`Server is running on ${port}`);

var once = true;
const onConnection = (socket) => {
    console.log("New connection with id: " + socket.id);
    if (once) socket.emit("refresh");
    once = false;
}

io.on("connection", onConnection);