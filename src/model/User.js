const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const bcrypt = require('bcryptjs');
const User = new Schema({

  username: { type: String },
  account: { type: String },
  password: { type: String },
  age: { type: Number },
  role: { type: Number },

  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },

});
// Hàm mã hóa mật khẩu trước khi lưu vào database
// User.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//   }
//   next();
// });

// // So sánh mật khẩu nhập với mật khẩu trong database
// User.methods.comparePassword = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };

module.exports = mongoose.model('user', User);