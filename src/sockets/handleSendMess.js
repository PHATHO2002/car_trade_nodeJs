const sendMessToSocket = (io, socket, usersOnline) => {
    socket.on('send_message', (data) => {
        const { senderId, receiverId, message, username } = data; // `to` là username của người nhận
        const userIndex = usersOnline.findIndex((user) => user.userId === receiverId);

        // Kiểm tra xem client có tồn tại không và gửi tin nhắn
        if (userIndex >= 0) {
            io.to(usersOnline[userIndex].socketId).emit('receive_message', data); // Gửi tin nhắn đến client cụ thể
        } else {
            socket.emit('send_message_error', {
                error: `User with ID ${receiverId} is not online.`, // Lỗi gửi tin nhắn
            });
        }
    });
};
module.exports = sendMessToSocket;
