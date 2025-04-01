const postPendingCarSocket = (io, socket) => {
    socket.on('addnewPendingCar', (carData) => {
        io.sockets.sockets.forEach((clientSocket) => {
            if (clientSocket.user?.role === 'admin') {
                // user data được gan từ middeleware
                clientSocket.emit('pendingCarNotification', {
                    message: 'Xe đang chờ duyệt!',
                    carData,
                });
            }
        });
    });
};
module.exports = postPendingCarSocket;
