const express = require('express');
const http = require('http'); // Để tạo HTTP server
const app = express();
const cookieParser = require('cookie-parser');
const router = require('./src/route/index.js');
const cors = require('cors');
const Db = require('./src/config/dbConfig.js');
const connectOrReturnRedis = require('./src/config/redis.js');
const { setupSocket } = require('./src/config/socket.js');
const path = require('path');
require('dotenv').config();

(async () => {
    // Tạo HTTP server
    const server = http.createServer(app);

    app.use('/', express.static(path.join('./src', 'public')));
    app.set('view engine', 'ejs');
    app.set('views', path.join('./src', 'views'));
    if (process.env.NODE_ENV == 'production') {
        app.use(
            cors({
                origin: 'https://www.muabanotocu.click',
                credentials: true, // Cho phép gửi cookie qua request
            }),
        );
    } else {
        app.use(
            cors({
                origin: 'http://localhost:3000',
                credentials: true, // Cho phép gửi cookie qua request
            }),
        );
    }

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    await Db.connect(app);
    await connectOrReturnRedis();
    router(app);

    const port = process.env.PORT || 5000;
    setupSocket(server);
    server.listen(port, () => {
        console.log(`app listening on ${port}`);
    });
})();
