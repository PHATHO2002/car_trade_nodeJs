const BaseService = require('./baseService');
const pendingCarSchema = require('../models/pendingCar');
const { data } = require('jquery');
class AdminService extends BaseService {
    getPendingCars = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const pendingCars = await pendingCarSchema.find({ status: 'pending' });
                return resolve(this.successResponse('get pending car success ', pendingCars));
            } catch (error) {
                reject(error);
            }
        });
    };
    decisionPendingCar = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!data.status || !(data.status == 'accepted' || data.status == 'rejected')) {
                    return resolve(this.errorResponse(400, 'status không đúng'));
                }
                if (this.validateId(data.id)) {
                    return resolve(this.errorResponse(400, this.validateId(data.id)));
                }
                const pendingCar = await pendingCarSchema.findByIdAndUpdate(
                    data.id,
                    { status: data.status },
                    { new: true },
                );
                return resolve(this.successResponse(' decision pending car success ', pendingCar));
            } catch (error) {
                reject(error);
            }
        });
    };
    getCarForAmin = (query) => {
        return new Promise(async (resolve, reject) => {
            try {
                const Cars = await pendingCarSchema.find({ ...query });
                if (Cars.length === 0) return resolve(this.errorResponse(400, `empty `));
                return resolve(this.successResponse(`get  car success `, Cars));
            } catch (error) {
                reject(error);
            }
        });
    };
    getBrandCountByMonth = (month = null, year = null) => {
        return new Promise(async (resolve, reject) => {
            try {
                const now = new Date();
                // Nếu không có truyền vào thì dùng tháng/năm hiện tại
                const currentMonth = now.getMonth() + 1; // getMonth trả từ 0-11
                const currentYear = now.getFullYear();
                const selectedMonth = Number(month) || currentMonth;
                const selectedYear = Number(year) || currentYear;

                const rsp = await pendingCarSchema.aggregate([
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: [{ $month: '$createdAt' }, selectedMonth] },
                                    { $eq: [{ $year: '$createdAt' }, selectedYear] },
                                ],
                            },
                        },
                    },
                    {
                        $group: {
                            _id: '$brand',
                            count: { $sum: 1 },
                        },
                    },
                    {
                        $project: {
                            brand: '$_id',
                            count: 1,
                            _id: 0,
                        },
                    },
                ]);

                if (rsp.length === 0) {
                    return resolve(this.errorResponse(400, 'No brands found in selected month.'));
                }

                return resolve(this.successResponse('Get brands success!', rsp));
            } catch (error) {
                reject(error);
            }
        });
    };
}

module.exports = new AdminService();
