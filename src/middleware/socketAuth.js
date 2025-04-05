const jwt = require('jsonwebtoken');
require('dotenv').config();

const socketAuth = (socket, next) => {
    const token = socket.handshake.auth?.token; // Lấy token từ handshake.auth
    if (!token) {
        return next(new Error('Authentication error: No token provided'));
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return next(new Error(`Authentication error: ${err.name}`));
        }

        socket.user = decoded; // Lưu thông tin user vào socket
        next();
    });
};

module.exports = socketAuth;
