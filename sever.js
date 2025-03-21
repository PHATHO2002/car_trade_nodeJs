const express = require('express');
const http = require('http'); // Để tạo HTTP server
const app = express();
const cookieParser = require('cookie-parser');
const router = require('./src/route/index.js');
const cors = require('cors');
const Db = require('./src/config/dbConfig.js');
const { setupSocket } = require('./src/config/socket.js');
const path = require('path');
require('dotenv').config();

(async () => {
    // Tạo HTTP server
    const server = http.createServer(app);

    app.use('/', express.static(path.join('./src', 'public')));
    app.set('view engine', 'ejs');
    app.set('views', path.join('./src', 'views'));
    app.use(
        cors({
            origin: 'http://localhost:3000', // Chỉ cho phép frontend này gọi API
            credentials: true, // Cho phép gửi cookie qua request
        }),
    );

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    Db.connect(app);
    router(app);

    const port = process.env.PORT || 4000;
    setupSocket(server);
    server.listen(port, () => {
        console.log(`app listening on ${port}`);
    });
})();
