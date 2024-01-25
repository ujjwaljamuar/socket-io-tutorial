import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const port = 4000;
const app = express();

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log("new user connected ", socket.id);

    socket.emit("welcome", `welcome to the server ${socket.id}`);
    socket.broadcast.emit("welcome", `${socket.id} has joined the server`);

    socket.on("message", ({ room, message }) => {
        console.log(message);

        io.to(room).emit("receive-message", message);
    });

    socket.on("join-room", (room) => {
        socket.join(room)
    })

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
    });
});

app.get("/", (req, res) => {
    res.send("working");
});

server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
