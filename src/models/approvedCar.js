const mongoose = require('mongoose');

const approvedCarSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    images: { type: [String], required: true },
    approvedAt: { type: Date, default: Date.now }, // Ngày duyệt
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Ai duyệt
});

module.exports = mongoose.model('approvedCar', approvedCarSchema);
