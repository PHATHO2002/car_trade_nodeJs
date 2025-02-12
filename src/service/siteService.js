const BaseService = require('./baseService');
const userSchema = require('../models/user');
const jwt = require('jsonwebtoken');
const refreshTokenSchema = require('../models/refreshToken');
class SiteService extends BaseService {
    constructor() {
        super();
    }
    login = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { username, password } = data;
                if (
                    !username ||
                    typeof username !== 'string' ||
                    username.trim() === '' ||
                    !password ||
                    typeof password !== 'string' ||
                    password.trim() === ''
                ) {
                    return resolve(this.errorResponse(400, 'tài khoản mật khẩu không được để trống'));
                }

                const user = await userSchema.findOne({ username });

                if (!user) {
                    return resolve(this.errorResponse(400, 'Tài khoản  không đúng!'));
                }
                const isMatch = await user.comparePassword(password);
                if (!isMatch) {
                    return resolve(this.errorResponse(400, ' mật khẩu không đúng!'));
                }
                const { role } = user;

                let payLoad = {
                    role: role,
                    username: username,
                    userId: user._id,
                };

                const accessToken = jwt.sign(payLoad, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
                const refreshToken = jwt.sign(payLoad, process.env.REFRESH_TOKEN_SECRET);
                const userId = user._id;
                await refreshTokenSchema.findOneAndUpdate(
                    { userId: userId }, // Tìm user đã có refreshToken
                    { refreshToken: refreshToken }, // Cập nhật token mới
                    { upsert: true, new: true }, // Nếu chưa có thì tạo mới
                );

                return resolve(this.successResponse('login successFully ', { accessToken, refreshToken }));
            } catch (error) {
                reject(error);
            }
        });
    };
    logout = (refreshToken) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!refreshToken) return resolve(this.errorResponse(400, 'Không có Refresh Token'));
                await refreshTokenSchema.deleteOne({ refreshToken: refreshToken });
                return resolve(this.successResponse('logout successFully '));
            } catch (error) {
                reject(error);
            }
        });
    };
}

module.exports = new SiteService();
