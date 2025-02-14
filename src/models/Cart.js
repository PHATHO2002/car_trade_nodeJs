const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true, trim: true },
    carIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'pendingCar' }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('cart', cartSchema);
