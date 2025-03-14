const BaseService = require('./baseService');
const pendingCarSchema = require('../models/pendingCar');
const carBrandSchema = require('../models/brandCar');
const userSchema = require('../models/user');
class CarService extends BaseService {
    constructor() {
        super();
    }
    getBrands = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const rsp = await carBrandSchema.find();
                if (rsp.length == 0) {
                    return resolve(this.errorResponse(400, 'no local brand here'));
                }
                return resolve(this.successResponse('get brans succes!', rsp));
             
            } catch (error) {
                reject(error);
            }
        });
    };
    get = (query) => {
        return new Promise(async (resolve, reject) => {
            try {
                const Cars = await pendingCarSchema.find(query);
                if (Cars.length === 0) return resolve(this.errorResponse(400, `empty `));
                return resolve(this.successResponse(`get } car success `, Cars));
            } catch (error) {
                reject(error);
            }
        });
    };
    create = (userId, files, username, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const err = this.validateCarData(data);
                if (err) return resolve(this.errorResponse(400, err));

                // Tìm người bán theo userId
                const seller = await userSchema.findById(userId);
                if (!seller) {
                    return resolve(this.errorResponse(400, `Không tồn tại user id ${userId}`));
                }
                const carImages = files.carImages ? files.carImages.map((file) => file.path) : [];
                const documentImages = files.documentImages ? files.documentImages.map((file) => file.path) : [];

                const newPendingCar = new pendingCarSchema({
                    title: data.title,
                    brand: data.brand,
                    year: data.year,
                    mileage: data.mileage,
                    condition: data.condition,
                    price: data.price,
                    description: data.description,
                    address: seller.address,
                    sellerName: username,
                    sellerId: userId,
                    images: carImages,
                    documentImages: documentImages,
                    status: 'pending',
                });

                await newPendingCar.save();
                return resolve(this.successResponse('Đăng tin bán xe thành công!', newPendingCar));
            } catch (error) {
                reject(error);
            }
        });
    };

    delete = (userId, id) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.validateId(id)) {
                    console.log(id);
                    return resolve(this.errorResponse(400, 'carId không hợp lệ'));
                }
                const deletedPost = await pendingCarSchema.findOneAndDelete({
                    sellerId: userId,
                    _id: id,
                });
                if (deletedPost) {
                    return resolve(this.successResponse('Xóa car thành công', deletedPost));
                } else {
                    return resolve(this.errorResponse(404, 'Không tìm thấy car'));
                }
            } catch (error) {
                reject(error);
            }
        });
    };
    search = (query) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!query.trim()) return resolve(this.errorResponse(400, 'query empty'));
                const response = await pendingCarSchema.find({
                    $and: [{ title: { $regex: query, $options: 'i' } }, { status: 'accepted' }],
                });
                return resolve(this.successResponse('search success ', response));
            } catch (error) {
                reject(error);
            }
        });
    };
}
module.exports = new CarService();
