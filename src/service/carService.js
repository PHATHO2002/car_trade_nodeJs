const BaseService = require('./baseService');
const pendingCarSchema = require('../models/pendingCar');
const carBrandSchema = require('../models/brandCar');

class CarService extends BaseService {
    constructor() {
        super();
    }
    getBrands = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const rsp = carBrandSchema.find();
                return resolve(this.successResponse('Đăng tin bán xe thành công!', newPendingCar));
            } catch (error) {
                reject(error);
            }
        });
    };
    postTradeCar = (userId, files, username, data) => {
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
    getApprovaledCar = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const approvaledCars = await pendingCarSchema.find({ status: 'accepted' });
                if (approvaledCars.length === 0) return resolve(this.errorResponse(400, 'empty approvaledCars'));
                return resolve(this.successResponse('get Approval car success ', approvaledCars));
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
