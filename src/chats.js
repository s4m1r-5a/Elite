const request = require('request');
module.exports = (io, emitter) => {
    io.on('connection', (socket) => {
        console.log('socket connection opened:', socket.id);

        socket.on('message', function (data) {
            var options = {
                method: 'POST',
                url: 'https://eu89.chat-api.com/instance107218/sendMessage?token=5jn3c5dxvcj27fm0',
                form: {
                    chatId: data.id,
                    body: data.body
                }
            };
            request(options, function (error, response, body) {
                if (error) return console.error('Failed: %s', error.message);
                io.sockets.emit('env', body);
                console.log('Success: ', body);
            });
        });

    });
    emitter.on('messages', (msg, status) => {
        //console.log(msg, status);
        io.sockets.emit('messages', msg);
    })
    emitter.on('typing', (msg, status) => {
        //console.log(msg, status);
        io.sockets.emit('typing', msg);
    })
    emitter.on('chatUpdate', (msg, status) => {
        console.log(msg, status);
        io.sockets.emit('typing', msg);
    })

}