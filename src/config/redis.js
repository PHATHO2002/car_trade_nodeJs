const { createClient } = require('redis');

let clientRedis = null; // Lưu trữ instance của Redis client

const connectOrReturnRedis = async () => {
    try {
        // Nếu chưa có instance, tạo mới
        if (!clientRedis) {
            clientRedis = createClient({
                username: process.env.REDIS_USERNAME,
                password: process.env.REDIS_PASSWORD,
                socket: {
                    host: process.env.REDIS_HOST,
                    port: process.env.REDIS_PORT,
                },
            });

            clientRedis.on('error', (err) => console.error('❌ Redis Client Error:', err));
        }

        // Nếu chưa kết nối hoặc đã bị đóng, kết nối lại
        if (!clientRedis.isOpen) {
            await clientRedis.connect();
            console.log(' Redis connected successfully');
        }

        return clientRedis;
    } catch (error) {
        console.error(' Redis connection failed:', error);
        throw error; // Quan trọng: Ném lỗi để xử lý phía trên
    }
};

module.exports = connectOrReturnRedis;
