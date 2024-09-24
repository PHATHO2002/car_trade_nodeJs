require('dotenv').config();
const mongoose = require('mongoose');

class DbConfig {
    constructor(MONGO_USERNAME, MONGO_PASSWORD, MONGO_DATABASE) {


        this.MONGO_USERNAME = MONGO_USERNAME;
        this.MONGO_PASSWORD = MONGO_PASSWORD;
        this.MONGO_DATABASE = MONGO_DATABASE;

    }


}
class Db extends DbConfig {
    constructor() {
        super(process.env.MONGO_USERNAME, process.env.MONGO_PASSWORD, process.env.MONGO_DATABASE)
    }


    connect = async () => {
        try {

            // Kết nối đầy đủ với tên database
            const connectionString = `mongodb+srv://${this.MONGO_USERNAME}:${this.MONGO_PASSWORD}@app-chat.ro7za.mongodb.net/${this.MONGO_DATABASE}`;

            await mongoose.connect(connectionString, {
                useNewUrlParser: true,    // Tùy chọn để tránh cảnh báo
                useUnifiedTopology: true  // Tùy chọn để tránh cảnh báo
            });

            console.log('Database connected successfully!');
        } catch (error) {
            console.error('Database connection failed:', error);
        }
    }
}
module.exports = new Db();
