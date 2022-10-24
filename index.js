const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');
const formatMessage = require('./utils/messages');
const { userJoin, 
        getCurrentUser,
        userLeave,
        getRoomUsers } = require('./utils/users');

// config
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000;

app.use(express.static(path.join(__dirname + '\\public')));
// when a message is sent by the server
const adminName = 'admin'

// Run when client connects
io.on('connection', (socket) => {

    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        socket.emit('message', formatMessage(adminName, `Welcome to ${room}!`));
        
        socket.broadcast.to(user.room).emit('message', formatMessage(adminName, `${user.username} has joined the chat.`));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room),
        });
    });
    
    // listen for userChatMessage
    socket.on('userChatMessage', (msg) => {

        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Run when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user) {
            io.to(user.room).emit('message', formatMessage(adminName, `${user.username} disconnected from the chat.`));
        }

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room),
        });

    });
})

server.listen(PORT, () => {
    console.log(`Sever running on localhost:${PORT}`);
})