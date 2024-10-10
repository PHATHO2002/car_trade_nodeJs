const userSchema = require("../model/User")
const BaseService = require('./baseService')

class UserService extends BaseService {
    getAllUser = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const users = await userSchema.find({})
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
    createNewUser = (data) => {
        return new Promise(async (resolve, reject) => {

            try {
                const { userName, password, avatarCloud } = data;
                if (!userName || !password) {
                    return resolve({
                        errCode: 1,
                        message: 'Username or password is null!',
                        data: null,
                    });
                }
                // Kiểm tra xem người dùng đã tồn tại chưa
                const existingUser = await userSchema.findOne({ userName });
                if (existingUser) {
                    return resolve({
                        errCode: 2,
                        message: 'Username already exists! please chose another name',
                        data: null,
                    });
                }

                // Tạo một người dùng mới
                const newUser = new userSchema({ userName, password, avatarCloud, role: 1 });
                await newUser.save(); // Lưu người dùng vào cơ sở dữ liệu
                return resolve({
                    errCode: 0,
                    message: 'User registered successfully!',
                    data: { userName, avatarCloud },
                });
            } catch (error) {
                reject(error);
            }
        })

    }

}
module.exports = new UserService();