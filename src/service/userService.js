const UserDb = require("../model/User")
class BaseService {

    login = async (data) => {
        return new Promise(async (resolve, reject) => {
            try {

                const { account, password } = data;

                if (account && password) {
                    const user = await UserDb.findOne({ account, password }).select('_id role name');;
                    if (!user) {
                        return resolve({
                            errCode: 2,
                            message: 'Invalid account or password',
                            data: null,
                        });

                    }
                    resolve({
                        errCode: 0,
                        message: 'login successfuly',
                        data: user,
                    });

                } else {
                    return resolve({
                        errCode: 1,
                        message: 'account or password dont exits',
                        data: null,
                    });
                }



            } catch (error) {
                reject(error);
            }
        })
    }

}
class UserService extends BaseService {
    getAllUser = async () => {
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
    createNewUser = async () => {

    }

}
module.exports = new UserService();