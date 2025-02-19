const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId, // Đối tượng user gửi tin nhắn
            ref: 'users', // Đảm bảo liên kết tới Schema User
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId, // Đối tượng user nhận tin nhắn
            ref: 'users', // Đảm bảo liên kết tới Schema User
            required: true,
        },
        message: {
            type: String, // Nội dung tin nhắn
            required: true,
        },
        timestamp: {
            type: Date, // Thời gian gửi tin nhắn
            default: Date.now,
        },
    },
    {
        timestamps: true, // Tự động tạo trường createdAt và updatedAt
    },
);

module.exports = mongoose.model('Chat', chatSchema);
