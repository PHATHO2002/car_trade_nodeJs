const BaseService = require('./baseService');
const userSchema = require('../models/user');

const cartSchema = require('../models/Cart');

class UserService extends BaseService {
    constructor() {
        super();
    }
    create = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { username, password } = data || {};
                if (
                    !username ||
                    typeof username !== 'string' ||
                    username.trim() === '' ||
                    !password ||
                    typeof password !== 'string' ||
                    password.trim() === ''
                ) {
                    return resolve(errorResponse(400, 'Invalid username and password'));
                }
                // Kiểm tra xem người dùng đã tồn tại chưa
                const existingUser = await userSchema.findOne({
                    username: username,
                });
                if (existingUser) {
                    return resolve(this.errorResponse(400, 'Username already exists! please chose another name'));
                }

                const newUser = new userSchema({ username, password, role: 'user' });
                await newUser.save();
                const userId = newUser._id;
                const newCart = new cartSchema({ userId, carIds: [] });
                await newCart.save();
                return resolve(this.successResponse('User registered successfully!'));
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
