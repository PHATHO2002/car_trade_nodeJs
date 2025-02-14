const BaseService = require('./baseService');
const userSchema = require('../models/user');
const pendingCarSchema = require('../models/pendingCar');
const cartSchema = require('../models/Cart');
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
                const userId = newUser._id;
                const newCart = new cartSchema({ userId, carIds: [] });
                await newCart.save();
                return resolve(this.successResponse('User registered successfully!'));
            } catch (error) {
                reject(error);
            }
        });
    };
    postTradeCar = (userId, files, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const err = this.validateCarData(data);
                if (err) return resolve(this.errorResponse(400, err));
                const imageUrls = files.map((file) => file.path);
                const userIdexist = await userSchema.findById(userId);
                if (!userIdexist) {
                    return resolve(this.errorResponse(400, `không tồndd tại user id ${userId}`));
                }
                const newPendingCar = new pendingCarSchema({
                    title: data.title,
                    price: data.price,
                    description: data.description,
                    address: data.address,
                    sellerId: userId,
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
    getApprovaledCar = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const approvaledCars = await pendingCarSchema.find({ status: 'accepted' });
                return resolve(this.successResponse('get Approval car success ', approvaledCars));
            } catch (error) {
                reject(error);
            }
        });
    };
    addToCart = (userId, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.validateId(userId)) {
                    return resolve(this.errorResponse(400, 'userId không hợp lệ'));
                }
                if (this.validateId(data.carId)) {
                    return resolve(this.errorResponse(400, 'carId không hợp lệ'));
                }
                await cartSchema.findOneAndUpdate(
                    { userId: userId }, // Điều kiện tìm
                    { $push: { carIds: data.carId } }, // Dữ liệu cần cập nhật
                    { new: true, runValidators: true }, // Tùy chọn
                );
                return resolve(this.successResponse('add to cart success '));
            } catch (error) {
                reject(error);
            }
        });
    };
    deleteItemInCart = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.validateId(data.cartId)) {
                    return resolve(this.errorResponse(400, 'userId không hợp lệ'));
                }
                if (this.validateId(data.cartId)) {
                    return resolve(this.errorResponse(400, 'cartId không hợp lệ'));
                }
                const items = cartSchema.findOne({ _id: data.cartId }).select('carIds');
                // await cartSchema.findOneAndUpdate(
                //     { userId: userId }, // Điều kiện tìm
                //     { $push: { carIds: data.carId } }, // Dữ liệu cần cập nhật
                //     { new: true, runValidators: true }, // Tùy chọn
                // );
                return resolve(this.successResponse('delete item in cart success ', items));
            } catch (error) {
                reject(error);
            }
        });
    };
    getCart = (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.validateId(userId)) {
                    return resolve(this.errorResponse(400, this.validateId(userId)));
                }
                const carts = await cartSchema
                    .findOne(
                        { userId: userId }, // Tùy chọn
                    )
                    .populate('carIds')
                    .exec();

                return resolve(this.successResponse('get carts car success ', carts));
            } catch (error) {
                reject(error);
            }
        });
    };
}
module.exports = new UserService();
