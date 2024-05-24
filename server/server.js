const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);


const port = process.env.PORT || 5000;
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000", // Update this to match your client URL
        methods: ["GET", "POST"]
    }
});

app.use(cors({
    origin: "http://localhost:3000", // Update this to match your client URL
}));
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
        socket.to(room).emit('user-joined', { id: socket.id });
    });

    socket.on('signal', (data) => {
        console.log(`Signal from ${socket.id} to ${data.to}`);
        io.to(data.to).emit('signal', { from: socket.id, signal: data.signal });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        io.emit('user-left', socket.id);
    });
});

server.listen(port, () => console.log(`Server is running on port ${port}`));
