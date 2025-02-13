const SiteService = require('../service/siteService');
require('dotenv').config();
const refreshTokenSchema = require('../models/refreshToken');
const jwt = require('jsonwebtoken');
class SiteController {
    refreshtoken = async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            const isExitRefreshToken = await refreshTokenSchema.findOne({ refreshToken: refreshToken });
            if (!refreshToken) return res.status(403).json({ message: 'Không có refresh token' });
            if (!isExitRefreshToken) return res.status(403).json({ message: 'Refresh token không hợp lệ' });

            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(403).json({ message: 'Refresh token hết hạn' });
                const payLoad = {
                    userId: user.userId,
                    username: user.username,
                    role: user.role,
                    iat: Math.floor(Date.now() / 1000),
                };
                const newAccessToken = jwt.sign(payLoad, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
                res.status(200).json({ accessToken: newAccessToken });
            });
        } catch (error) {
            console.error(error); // Sử dụng console.error để in rõ ràng lỗi
            res.status(500).json({ error: error.message });
        }
    };

    login = async (req, res) => {
        try {
            const response = await SiteService.login(req.body);
            if (response.data) {
                res.cookie('refreshToken', response.data.refreshToken, {
                    httpOnly: true, // Ngăn JavaScript truy cập cookie → Chống XSS
                    secure: true, // Chỉ gửi cookie qua HTTPS → Bảo mật hơn
                    sameSite: 'Strict', // Chặn gửi cookie từ trang khác → Chống CSRF
                });
                let { accessToken, refreshToken } = response.data;
                response.data = { accessToken };
            }

            res.status(response.status).json(response);
        } catch (error) {
            console.error(error); // Sử dụng console.error để in rõ ràng lỗi
            res.status(500).json({ message: 'server error' });
        }
    };
    logout = async (req, res) => {
        try {
            const response = await SiteService.logout(req.cookies.refreshToken);
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
            });
            res.status(response.status).json(response);
        } catch (error) {
            console.error(error); // Sử dụng console.error để in rõ ràng lỗi
            res.status(500).json({ message: 'server error' });
        }
    };
    test = async (req, res) => [res.status(200).json('this is sever ')];
}
module.exports = new SiteController();
