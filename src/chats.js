module.exports = (io, emitter) => {
    io.on('connection', (socket) => {
        console.log('socket connection opened:', socket.id);

        socket.on('chat:message', function (data) {
            io.sockets.emit('chat:message', data);
        });

        socket.on('chat:typing', function (data) {
            socket.broadcast.emit('chat:typing', data);
        });
    });

    emitter.on('samir', (msg, status) => {
        console.log(msg, status);
        io.sockets.emit('chat:message', {
            message: msg,
            username: 'Red Elite'
        });
    })
}