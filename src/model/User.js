const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const bcrypt = require('bcryptjs');
const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
  title: { type: String, required: true },
});
const userSchema = new Schema({

  userName: { type: String, required: true, unique: true },

  password: { type: String, required: true },
  avatarCloud: { type: String },
  role: { type: Number },
  cart: [cartItemSchema],
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },

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

module.exports = mongoose.model('user', userSchema);