$(document).ready(function() {
    var socket = io();
    var input = $('input');
    var messages = $('#messages');
    
    var addMessage = function(message) {
        messages.append('<span class="list-group-item list-group-item-info give">' + message + '</span>');
    };
    
    var insertTime = function(data) {
        messages.append('<span class="list-group-item time">' + data + '</span>');
    };

    input.on('keydown', function(event) {
        if (event.keyCode != 13) {
            return;
        }
        var message = input.val();
        addMessage(message);
        socket.emit('message', message);
        input.val('');
    });
    
    socket.on('time', function(data) {
        insertTime(data.time);
    });

    socket.on('welcome', function(welcome) {
        var hello = 'Welcome!';
        messages.append('<span class="list-group-item list-group-item-warning welcome">' + hello + '</span>');
    });
    socket.on('enter', function(enter) {
        var join = 'New user joined';
        messages.append('<span class="list-group-item disabled notice">' + join + '</span>');
    });
    socket.on('message', function(message) {
        socket.emit(messages.append('<span class="list-group-item list-group-item-success take">' + message + '</span>'));
    });
    socket.on('disconnect', function(leave) {
        var exit = 'The user left';
        messages.append('<span class="list-group-item list-group-item-danger bye">' + exit + '</span>');
    });
});