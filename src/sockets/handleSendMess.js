const sendMessToSocket = (io, socket, usersOnline) => {
    socket.on('send_message', (data) => {
        const { senderId, receiverId, message, username } = data; // `to` là username của người nhận

        // Kiểm tra xem người nhận có online hay không
        const receiver = usersOnline[receiverId];

        if (receiver) {
            // Nếu người nhận online, gửi tin nhắn đến socketId của người nhận
            io.to(receiver).emit('receive_message', data); // Gửi tin nhắn đến client cụ thể
        } else {
            // Nếu người nhận không online, gửi lỗi về client
            socket.emit('send_message_error', {
                error: `User with ID ${receiverId} is not online.`, // Lỗi gửi tin nhắn
            });
        }
    });
};

module.exports = sendMessToSocket;
