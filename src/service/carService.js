const BaseService = require('./baseService');
const pendingCarSchema = require('../models/pendingCar');
const carBrandSchema = require('../models/brandCar');
const userSchema = require('../models/user');

require('dotenv').config();
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
                const Cars = await pendingCarSchema.find({ ...query, status: 'accepted' });
                if (Cars.length === 0) return resolve(this.errorResponse(400, `empty `));
                return resolve(this.successResponse(`get  car success `, Cars));
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
                if (!seller.email) {
                    return resolve(this.errorResponse(400, `bạn chưa cập nhật email vui lòng  và profile cập nhật`));
                }
                if (!seller.address.province.code) {
                    return resolve(this.errorResponse(400, `bạn chưa cập nhật địa chỉ vui lòng  và profile cập nhật`));
                }
                if (!seller.phone) {
                    return resolve(
                        this.errorResponse(400, `bạn chưa cập nhật số điện thoại vui lòng  và profile cập nhật`),
                    );
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
                let htmlContentToSendemail = ` <div style="max-width: 400px; margin: 20px auto; padding: 15px; background: #e6ffe6; border-left: 5px solid #28a745; border-radius: 5px; text-align: center; font-family: Arial;">
                <h3 style="color: #28a745;">🎉 Đăng tin thành công!</h3>
                <p style="color: #333;">Tao chủ tịch fifa chúc mừng mày đã đăng tin thành công.</p>
            </div>`;
                this.sendEmail(
                    process.env.SENDER_EMAIL_DOMAIN,
                    'chủ tịch fifa',
                    seller.email,
                    'hello tg em',
                    'Đây là thông tin post của bạn',
                    htmlContentToSendemail,
                )
                    .then((response) => {
                        return resolve(
                            this.successResponse(
                                'Đăng tin bán xe thành công! và gửi mail cho bạn để chúc mừng ',
                                newPendingCar,
                            ),
                        );
                    })
                    .catch((err) => {
                        console.log(err);
                        return resolve(this.successResponse('Đăng tin bán xe thành công! ', newPendingCar));
                    });
            } catch (error) {
                console.log(error); //logs any error
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
    // just update saleStatus of car
    update_saleStatus = (userId, id, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.validateId(id)) {
                    return resolve(this.errorResponse(400, 'carId không hợp lệ'));
                }
                if (!data.saleStatus) {
                    const requiredValues = ['available', 'reserved', 'sold'];
                    if (!requiredValues.includes(data.saleStatus)) {
                        return resolve(this.errorResponse(400, 'saleStatus không hợp lệ'));
                    }
                }
                const response = await pendingCarSchema.findOneAndUpdate(
                    { sellerId: userId, _id: id },
                    { saleStatus: data.saleStatus },
                    { new: true },
                );
                if (response) {
                    return resolve(this.successResponse('update saleStatus success', response));
                } else {
                    return resolve(this.errorResponse(404, 'Không tìm thấy car'));
                }
            } catch (error) {
                reject(error);
            }
        });
    };
}
module.exports = new CarService();
