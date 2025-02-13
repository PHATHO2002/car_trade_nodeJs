const { Server } = require('socket.io');
const socketAuth = require('../middleware/socketAuth');
const postPendingCarSocket = require('../sockets/handlerPostSocket');
const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
        },
    });
    io.use(socketAuth);
    io.on('connection', (socket) => {
        console.log(`⚡ New client connected: ${socket.id}`);
        postPendingCarSocket(io, socket);
        socket.on('disconnect', () => {
            console.log(`❌ Client disconnected: ${socket.id}`);
        });
    });
};

module.exports = { setupSocket };
