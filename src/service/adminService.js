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
}

module.exports = new AdminService();
