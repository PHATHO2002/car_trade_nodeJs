const BaseService = require('./baseService');
const userSchema = require('../models/user');
const cartSchema = require('../models/Cart');

class UserService extends BaseService {
    constructor() {
        super();
    }
    sendOtpForRegistration = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { email, username, password } = data || {};

                if (!username || !password || !email) {
                    return resolve(this.errorResponse(400, 'username, password, email không được để trống'));
                }
                const err = this.validateUserData(data);
                if (err) return resolve(this.errorResponse(400, err));

                // Kiểm tra xem người dùng đã tồn tại chưa
                const existingUser = await userSchema.findOne({
                    username: username,
                });
                if (existingUser) {
                    return resolve(this.errorResponse(400, 'Username đã tồn tại! vui lòng chọn username khác'));
                }
                const existingEmailUser = await userSchema.findOne({ email: email });
                if (existingEmailUser) {
                    return resolve(this.errorResponse(400, 'Email đã tồn tại! vui lòng chọn email khác'));
                }
                const otp = (Math.floor(Math.random() * 900000) + 100000).toString();
                await this.storeInRedis(email, otp, 300); // 5 phút hết hạn

                await this.sendEmail(
                    process.env.SENDER_EMAIL_DOMAIN,
                    'chủ tịch mua bán xe ô tô cũ',
                    email,
                    'hello bro',
                    'Đây là mã OTP của bạn',
                    `<h1> ${otp}</h1> <p> mã OTP của bạn hết hạn sau 5 phút</p>`,
                )
                    .then((response) => {
                        let exprireTime = 500;

                        return resolve(
                            this.successResponse('gưi mã OTP thành công! vào email của bạn để xác nhận tài khoản', {
                                exprireTime,
                            }),
                        );
                    })
                    .catch((err) => {
                        console.log(err);
                        return resolve(this.errorResponse(400, 'gửi mã OTP thất bại', err));
                    });
            } catch (error) {
                reject(error);
            }
        });
    };
    verifyAndRegisterUser = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { email, username, password, otp } = data || {};

                if (!username || !password || !email || !otp) {
                    return resolve(this.errorResponse(400, 'username, password, email,otp không được để trống'));
                }
                const err = this.validateUserData(data);
                if (err) return resolve(this.errorResponse(400, err));
                const existingUser = await userSchema.findOne({
                    username: username,
                });
                if (existingUser) {
                    return resolve(this.errorResponse(400, 'Username đã tồn tại! vui lòng chọn username khác'));
                }
                const existingEmailUser = await userSchema.findOne({ email: email });
                if (existingEmailUser) {
                    return resolve(this.errorResponse(400, 'Email đã tồn tại! vui lòng chọn email khác'));
                }

                await this.checkInRedis(email, otp, 'OTP')
                    .then(async (value) => {
                        const newUser = new userSchema({ username, password, email, role: 'user' });
                        await newUser.save();
                        const userId = newUser._id;
                        const newCart = new cartSchema({ userId, carIds: [] });
                        await newCart.save();
                        return resolve(this.successResponse('đăng ký tài khoản thành công', newUser));
                    })
                    .catch((err) => {
                        return resolve(this.errorResponse(400, err));
                    });
            } catch (error) {
                reject(error);
            }
        });
    };
    update = (userId, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const updateData = {};
                if (data.email) {
                    const existingEmailUser = await userSchema.findOne({ email: data.email, _id: { $ne: userId } });
                    if (existingEmailUser) {
                        return resolve(this.errorResponse(400, 'Email đã tồn tại.'));
                    }
                    updateData.email = data.email;
                }

                if (data.phone) {
                    const existingPhoneUser = await userSchema.findOne({ phone: data.phone, _id: { $ne: userId } });
                    if (existingPhoneUser) {
                        return resolve(this.errorResponse(400, 'Số điện thoại đã tồn tại.'));
                    }
                    updateData.phone = data.phone;
                }
                if (data.address) {
                    updateData.address = {};

                    if (data.address.province) {
                        updateData.address.province = {
                            code: data.address.province.code || '',
                            name: data.address.province.name || '',
                        };
                    }
                    if (data.address.district) {
                        updateData.address.district = {
                            code: data.address.district.code || '',
                            name: data.address.district.name || '',
                        };
                    }
                    if (data.address.ward) {
                        updateData.address.ward = {
                            code: data.address.ward.code || '',
                            name: data.address.ward.name || '',
                        };
                    }
                }

                const err = this.validateUserData(updateData);
                if (err) return resolve(this.errorResponse(400, err));
                const userUpdated = await userSchema.findOneAndUpdate(
                    { _id: userId },
                    { $set: updateData },
                    { returnDocument: 'after' },
                );
                return resolve(this.successResponse('update exits user infor success ', userUpdated));
            } catch (error) {
                reject(error);
            }
        });
    };
    updatePassword = (userId, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { oldPassword, newPassword } = data || {};
                if (!oldPassword || !newPassword) {
                    return resolve(this.errorResponse(400, 'oldPassword, newPassword không được để trống'));
                }
                const user = await userSchema.findById(userId);
                if (!user) {
                    return resolve(this.errorResponse(400, 'Không tìm thấy người dùng'));
                }
                const isMatch = await user.comparePassword(oldPassword);
                if (!isMatch) {
                    return resolve(this.errorResponse(400, 'mật khẩu cũ sai'));
                }
                const err = this.validateUserData({ password: newPassword });
                if (err) return resolve(this.errorResponse(400, err));
                user.password = newPassword;
                await user.save();
                return resolve(this.successResponse('update password success ', user));
            } catch (error) {
                reject(error);
            }
        });
    };

    get = (query) => {
        return new Promise(async (resolve, reject) => {
            try {
                const rp = await userSchema.find(query).select('-password');
                return resolve(this.successResponse('get User detail success ', rp));
            } catch (error) {
                reject(error);
            }
        });
    };
}
module.exports = new UserService();
