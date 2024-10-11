const userSchema = require("../model/User");
const refreshTokenDb = require('../model/refeshToken');
class SiteService {

    login = (data) => {
        return new Promise(async (resolve, reject) => {
            try {

                const { userName, password } = data;

                if (userName && typeof userName == 'string' && userName.trim() !== '' && password && typeof password == 'string' && password.trim() !== '') {

                    const user = await userSchema.findOne({ userName });

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
                        message: 'Invalid username and password',
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

                if (data.refreshToken && typeof data.refreshToken == 'string' && data.refreshToken.trim() !== '') {
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

module.exports = new SiteService();