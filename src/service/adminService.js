const BaseService = require('./baseService');
const pendingCarSchema = require('../models/pendingCar');
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
}

module.exports = new AdminService();
