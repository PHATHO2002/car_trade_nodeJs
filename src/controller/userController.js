const userService = require('../service/userService');
const jwt = require('jsonwebtoken');
const refreshTokenDb = require('../model/refeshToken');


require('dotenv').config();



class UserController {

    createNewUser = async (req, res) => {
        try {
            if (req.file) {
                req.body.avatarCloud = req.file.path;
            }
            let response = await userService.createNewUser(req.body);
            switch (response.errCode) {
                case 1:
                    return res.status(400).json(response);
                    break;
                case 2:
                    return res.status(409).json(response);
                    break;

                default:
                    return res.status(200).json(response);
                    break;
            }

        } catch (error) {
            console.error(error);  // Sử dụng console.error để in rõ ràng lỗi
            res.status(500).json({ error: error.message });
        }
    }
    login = async (req, res) => {
        try {

            const response = await userService.login(req.body);
            if (response.data) {
                let playLoad = {
                    _id: response.data._id,
                    role: response.data.role,
                    userName: response.data.userName,
                    avatar: response.data.avatarCloud

                };

                const accessToken = jwt.sign(playLoad, process.env.ACSSES_TOKEN_SECRET, { expiresIn: '60s' });
                const refreshToken = jwt.sign(playLoad, process.env.REFRESH_TOKEN_SECRET);
                await refreshTokenDb.create({
                    refreshToken: refreshToken,

                })

                response.data = { accessToken, refreshToken };
                return res.status(200).json(response);
            }
            return res.status(400).json(response);
        } catch (error) {
            console.error(error);  // Sử dụng console.error để in rõ ràng lỗi
            res.status(500).json({ error: error.message });
        }
    }
    logout = async (req, res) => {
        try {
            const response = await userService.logout(req.body);
            switch (response.errCode) {
                case 1:
                    return res.status(404).json(response);
                    break;
                case 2:
                    return res.status(404).json(response);
                    break;

                default:
                    return res.status(200).json(response);
                    break;
            }
        } catch (error) {
            console.error(error);  // Sử dụng console.error để in rõ ràng lỗi
            res.status(500).json({ error: error.message });
        }
    }
}
module.exports = new UserController();