const sendMessToSocket = (io, socket, usersOnline) => {
    socket.on('send_message', (data) => {
        const { senderId, receiverId, message, username } = data; // `to` là username của người nhận

        // Kiểm tra xem người nhận có online hay không
        const receiver = usersOnline[receiverId];

        // Nếu người nhận online, gửi tin nhắn đến socketId của người nhận
        io.to(receiver).emit('receive_message', data); // Gửi tin nhắn đến client cụ thể
    });
};
const handleTyping = (socket, usersOnline) => {
    socket.on('typing', ({ senderId, receiverId }) => {
        const receiverSocketId = usersOnline[receiverId];

        if (receiverSocketId) {
            socket.to(receiverSocketId).emit('typing', { senderId });
        }
    });
};
module.exports = { sendMessToSocket, handleTyping };
