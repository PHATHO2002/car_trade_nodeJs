const { Server } = require('socket.io');
const socketAuth = require('../middleware/socketAuth');
const postPendingCarSocket = require('../sockets/handlerPostSocket');
const usersOnline = [];
const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
        },
    });
    io.use(socketAuth);
    io.on('connection', (socket) => {
        console.log(`⚡ New client connected: ${socket.id}`);
        socket.on('user_connected', (data) => {
            const userIndex = usersOnline.findIndex((user) => user.userId === data.userId);

            if (userIndex !== -1) {
                // Nếu tìm thấy thì chỉ update socketId
                usersOnline[userIndex].socketId = socket.id;
            } else {
                // Nếu chưa tồn tại thì thêm mới
                usersOnline.push({ userId: data.userId, socketId: socket.id });
            }
            io.emit('users_online', usersOnline); // Gửi danh sách người dùng online đến tất cả client
        });
        postPendingCarSocket(io, socket);
        socket.on('disconnect', () => {
            const userIndex = usersOnline.findIndex((user) => user.socketId === socket.id);
            usersOnline.splice(userIndex, 1);
            io.emit('user_disconnected', usersOnline);
            console.log(`❌ Client disconnected: ${socket.id}`);
        });
    });
};

module.exports = { setupSocket };
