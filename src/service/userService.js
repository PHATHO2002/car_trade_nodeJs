const UserDb = require("../model/User")
class UserService {
    getUser() {
        return new Promise(async (resolve, reject) => {
            try {
                const users = await UserDb.find({})
                resolve({
                    errCode: 0,
                    message: 'get users succes',
                    data: users,
                });
            } catch (error) {
                reject(error);
            }
        })

    }
}
module.exports = new UserService();