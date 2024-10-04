const UserMd = require("../model/User");
const refreshTokenDb = require('../model/refeshToken');
class BaseService {

    login = (data) => {
        return new Promise(async (resolve, reject) => {
            try {

                const { userName, password } = data;

                if (userName && password) {

                    const user = await UserMd.findOne({ userName });

                    if (!user) {
                        return resolve({
                            errCode: 2,
                            message: 'tài khoản đéo đúng',
                            data: null,
                        });

                    }
                    const isMatch = await user.comparePassword(password);
                    if (!isMatch) {
                        return resolve({
                            errCode: 2,
                            message: 'mật khẩu sai',
                            data: null,
                        });
                    }
                    const { _id, avatarCloud, role } = user;

                    resolve({
                        errCode: 0,
                        message: 'login successfuly',
                        data: { _id, userName, role, avatarCloud },
                    });

                } else {
                    return resolve({
                        errCode: 1,
                        message: 'userName or password dont exits',
                        data: null,
                    });
                }



            } catch (error) {
                reject(error);
            }
        });
    }
    logout = (data) => {
        return new Promise(async (resolve, reject) => {
            try {

                if (data.refreshToken) {
                    const reslut = await refreshTokenDb.findOneAndDelete({ refreshToken: data.refreshToken })
                    if (!reslut) {
                        return resolve({
                            errCode: 2,
                            message: 'refreshToken not found in db',
                            data: null,
                        });
                    }
                    resolve({
                        errCode: 0,
                        message: 'logout successfully',
                        data: null,
                    });

                } else {
                    return resolve({
                        errCode: 1,
                        message: 'refreshToken exits',
                        data: null,
                    });
                }



            } catch (error) {
                reject(error);
            }
        })
    }

}

module.exports = BaseService;