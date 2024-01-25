import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import {
    Box,
    Button,
    Container,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

function App() {
    const socket = useMemo(() => io("http://localhost:4000"), []);

    const [socketId, setSocketId] = useState("");
    const [message, setMessage] = useState("");
    const [room, setRoom] = useState("");
    const [messages, setMessages] = useState([]);
    const [roomName, setRoomName] = useState("");

    // console.log(messages);

    useEffect(() => {
        socket.on("connect", () => {
            setSocketId(socket.id);
            console.log("connected to backend");
        });

        socket.on("welcome", (msg) => {
            console.log(msg);
        });

        socket.on("receive-message", (msg) => {
            console.log(msg);
            setMessages((messages) => [...messages, msg]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const submitHandler = (e) => {
        e.preventDefault();

        socket.emit("message", { message, room });
        setMessage("");
        // setRoom("");
    };

    const roomJoinHandler = (e) => {
        e.preventDefault();

        socket.emit("join-room", roomName)
        setRoomName("")
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ height: 200 }} />

            <Typography variant="h5">ID: {socketId}</Typography>

            <form onSubmit={roomJoinHandler}>
                <TextField
                    id="outlined-basic"
                    label="Room Name"
                    variant="outlined"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    required
                />

                <Button type="submit" variant="container" color="primary">
                    Join
                </Button>
            </form>

            <form onSubmit={submitHandler}>
                <TextField
                    id="outlined-basic"
                    label="room"
                    variant="outlined"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    required
                />

                <TextField
                    id="outlined-basic"
                    label="message"
                    variant="outlined"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                />
                <Button type="submit" variant="container" color="primary">
                    Send
                </Button>
            </form>

            <Stack>
                {messages.map((m, i) => (
                    <Typography
                        key={i}
                        variant="h6"
                        component={"div"}
                        gutterBottom
                    >
                        {m}
                    </Typography>
                ))}
            </Stack>
        </Container>
    );
}

export default App;
