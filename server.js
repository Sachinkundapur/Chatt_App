const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./public/utils/messages');
const {userJoin,getCurrentUser, userLeave,getRoomUsers} = require('./public/utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static('public'));
const botname = 'chatbox';

io.on('connect', socket => {
    socket.on('joinRoom',({username,formattedRoom})=>{
        const user = userJoin(socket.id, username, formattedRoom)
        socket.join(user.room)
    socket.emit("message", formatMessage(botname, "Welcome to chatbox"));
    socket.broadcast.to(user.room).emit("message", formatMessage(botname, `${user.username} has joined the chat`));
    
    io.to(user.room).emit('roomUser',{
        room:user.room,
        users:getRoomUsers(user.room)
    })


    })

    socket.on('charMessage', msg => { 
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', formatMessage(user.username ,msg));
    });

    socket.on("disconnect", () => {
        const user = userLeave(socket.id)
        if(user){
            io.to(user.room).emit('message',formatMessage(botname, `${user.username} has left the chat`));
            io.to(user.room).emit('roomUser',{
                room:user.room,
                users:getRoomUsers(user.room)
            })
        }
       
    });
});

server.listen(3000, () => {
    console.log('server listening on port 3000');
});
