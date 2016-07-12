var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

function sendTime() {
    /* Time displays 8 hours ahead in cloud9, works in REPL and terminal though */
    var hours = new Date().getHours();
    var minutes = new Date().getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    var ampm;
    if (hours < 12) {
        ampm = "AM";
    }
    if (hours > 12) {
        hours = hours - 12;
        ampm = "PM";
    }
    if (hours == 0) {
        hours = hours + 12;
        ampm = "AM";
    }
    if (hours == 12) {
        ampm = "PM";
    }
    io.emit('time', { time: hours + ":" + minutes + " " + ampm });
}

io.on('connection', function (socket) {
    console.log('Client connected');
    socket.on('disconnect', function() {
        console.log('Client disconnected');
    });
    
    socket.broadcast.emit('enter', 'A new user joined this chat');
    console.log(socket.id);
    
    socket.emit('welcome', { message: 'Welcome!', id: socket.id }, sendTime());

    socket.on('message', function(message) {
        console.log('Received message:', socket.id, message);
        socket.broadcast.emit('message', message);
    });
});

server.listen(8080);