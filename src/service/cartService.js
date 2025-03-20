const BaseService = require('./baseService');
const cartSchema = require('../models/Cart');
const { ObjectId } = require('mongodb');

class CartService extends BaseService {
    constructor() {
        super();
    }

    add = (userId, data) => {
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
    delete = (userId, id) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.validateId(userId)) {
                    return resolve(this.errorResponse(400, 'userId không hợp lệ'));
                }
                if (this.validateId(id)) {
                    return resolve(this.errorResponse(400, 'carId không hợp lệ'));
                }

                const result = await cartSchema.findOneAndUpdate(
                    { userId }, // Tìm giỏ hàng theo userId
                    { $pull: { carIds: id } }, // Xóa carId khỏi mảng carIds
                    { new: true },
                );
                if (!result) return resolve(this.errorResponse(400, 'no exits userId'));
                return resolve(this.successResponse('delete item in cart success ', result));
            } catch (error) {
                reject(error);
            }
        });
    };

    get = (userId) => {
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
module.exports = new CartService();
