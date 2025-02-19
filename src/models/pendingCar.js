const mongoose = require('mongoose');

const pendingCarSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    sellerName: { type: String, required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    images: { type: [String], required: true },
    status: { type: String, enum: ['pending', 'rejected'], default: 'pending' }, // Trạng thái duyệt
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('pendingCar', pendingCarSchema);
