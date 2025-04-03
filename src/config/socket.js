const { Server } = require('socket.io');
const socketAuth = require('../middleware/socketAuth');
const postPendingCarSocket = require('../sockets/handlerPostSocket');
const { sendMessToSocket, handleTyping } = require('../sockets/handleSendMess');

// Sử dụng Object để lưu trạng thái người dùng online
const usersOnline = {};

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
        },
    });

    io.use(socketAuth);

    io.on('connection', (socket) => {
        console.log(`⚡ New client connected: ${socket.id}`);

        try {
            socket.on('user_connected', (data) => {
                try {
                    // Lưu thông tin người dùng vào object usersOnline
                    usersOnline[data.userId] = socket.id;

                    // Gửi danh sách người dùng online cho tất cả client
                    io.emit('users_online', usersOnline);
                } catch (error) {
                    console.error(`Error processing 'user_connected' for user ${data.userId}:`, error);
                    socket.emit('error', { message: 'Failed to handle user connection' });
                }
            });

            // Gọi các hàm xử lý socket khác
            postPendingCarSocket(io, socket);
            sendMessToSocket(io, socket, usersOnline);
            handleTyping(socket, usersOnline);

            socket.on('disconnect', () => {
                try {
                    // Khi người dùng ngắt kết nối, xóa người dùng khỏi object usersOnline
                    const userId = Object.keys(usersOnline).find((userId) => usersOnline[userId] === socket.id);
                    if (userId) {
                        delete usersOnline[userId]; // Xóa user khỏi object
                    }

                    // Gửi lại danh sách người dùng online cho tất cả client
                    io.emit('users_online', JSON.stringify(usersOnline)); // Cập nhật danh sách người dùng online
                    console.log(`❌ Client disconnected: ${socket.id}`);
                } catch (error) {
                    console.error('Error processing disconnect:', error);
                    socket.emit('error', { message: 'Failed to handle disconnect' });
                }
            });
        } catch (error) {
            console.error('Error with socket connection:', error);
            socket.emit('error', { message: 'Something went wrong during socket connection' });
        }
    });
};

module.exports = { setupSocket };
