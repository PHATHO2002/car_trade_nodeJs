const postPendingCarSocket = (io, socket) => {
    socket.on('addnewPendingCar', (carData) => {
        io.sockets.sockets.forEach((clientSocket) => {
            if (clientSocket.user?.role === 'admin') {
                clientSocket.emit('pendingCarNotification', {
                    message: 'Xe đang chờ duyệt!',
                    carData,
                });
            }
        });
    });
};
module.exports = postPendingCarSocket;
