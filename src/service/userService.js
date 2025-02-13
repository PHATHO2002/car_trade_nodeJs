const BaseService = require('./baseService');
const userSchema = require('../models/user');
const pendingCarSchema = require('../models/pendingCar');
class UserService extends BaseService {
    constructor() {
        super();
    }
    createNewUser = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { username, password } = data;
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
                return resolve(this.successResponse('User registered successfully!'));
            } catch (error) {
                reject(error);
            }
        });
    };
    postTradeCar = (files, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const err = this.validateCarData(data);
                if (err) return resolve(this.errorResponse(400, err));
                const imageUrls = files.map((file) => file.path);
                const userId = await userSchema.findOne({
                    _id: data.sellerId,
                });
                if (!userId) {
                    return resolve(this.errorResponse(400, 'không tồn tại user id'));
                }
                const newPendingCar = new pendingCarSchema({
                    title: data.title,
                    price: data.price,
                    description: data.description,
                    address: data.address,
                    sellerId: data.sellerId,
                    images: imageUrls, // Lưu danh sách URL ảnh từ Cloudinary
                    status: 'pending',
                });
                await newPendingCar.save();
                return resolve(this.successResponse('đăng tin bán xe thành công!', newPendingCar));
            } catch (error) {
                reject(error);
            }
        });
    };
}
module.exports = new UserService();
