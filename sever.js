const express = require("express");
const http = require("http"); // Để tạo HTTP server
const { Server } = require("socket.io"); // Import class Server từ socket.io
const app = express();
const router = require('./src/route/index.js');
const { connect } = require('./src/config/dbConfig.js')
const sessionRedis = require('./src/config/sessionRedis.js');
const path = require('path');
require('dotenv').config();

// app.use(morgan('combined'));

(async () => {
    // Tạo HTTP server
    const server = http.createServer(app);

    // Tạo instance của socket.io với server vừa tạo
    const io = new Server(server);

    app.use('/', express.static(path.join('./src', 'public')));
    app.set('view engine', 'ejs');
    app.set('views', path.join('./src', 'views'));

    // config req.body
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    connect(app);
    await sessionRedis(app);
    router(app);

    //  Tạo kết nối với socket.io
    // io.on('connection', (socket) => {
    //     console.log('a user connected ' + socket.id);

    //     socket.on('disconnect', () => {
    //         console.log('user disconnected ' + socket.id);
    //     });
    //     socket.on("Client-send-data", function (data) {
    //         console.log(socket.id + ' vua gui ' + data)
    //         // io.sockets.emit("Sever-send-data", data + 888);//io.sockets.emit : trả về cho tất cả ;
    //         // socket.emit("Sever-send-data", data + 888); //socket.emit : trả về cho chính tg gửi tín hiệu lên;
    //         socket.broadcast.emit("Sever-send-data", data + 888);//trả về cho các tg khác;
    //     })
    // });

    const port = process.env.PORT || 3000;
    server.listen(port, () => {
        console.log(`app listening on ${port}`);
    });
})();