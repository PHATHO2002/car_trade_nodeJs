const mongoose = require('mongoose');

const pendingCarSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true }, // Hãng xe
    year: { type: Number, required: true }, // Năm sản xuất
    mileage: { type: Number, required: true }, // Số km đã đi
    condition: { type: String, required: true, trim: true }, // Tình trạng xe (VD: mới, đã qua sử dụng)
    price: { type: Number, required: true },
    description: { type: String, required: true },
    address: {
        province: {
            code: { type: String, default: '' }, // Mã tỉnh
            name: { type: String, default: '' }, // Tên tỉnh
        },
        district: {
            code: { type: String, default: '' }, // Mã huyện
            name: { type: String, default: '' }, // Tên huyện
        },
        ward: {
            code: { type: String, default: '' }, // Mã xã
            name: { type: String, default: '' }, // Tên xã
        },
    }, // Địa chỉ
    sellerName: { type: String, required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    images: { type: [String], required: true }, // Hình ảnh xe
    documentImages: { type: [String], required: true }, // Hình ảnh giấy tờ xe
    status: { type: String, enum: ['pending', 'rejected', 'deposited', 'sold'], default: 'pending' }, // Trạng thái duyệt
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('pendingCar', pendingCarSchema);
