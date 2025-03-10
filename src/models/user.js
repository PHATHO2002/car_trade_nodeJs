const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;
const bcrypt = require('bcryptjs');
const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, default: '' },
    role: { type: String },
    phone: { type: String, unique: true, default: '' }, // Không required
    email: { type: String, unique: true, default: '' }, // Không required
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
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
// Hàm mã hóa mật khẩu trước khi lưu vào database
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// So sánh mật khẩu nhập với mật khẩu trong database
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('users', userSchema);
