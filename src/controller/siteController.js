
const jwt = require('jsonwebtoken');
const refreshTokenDb = require('../model/refeshToken');
const SiteService = require("../service/siteService")
require('dotenv').config();



class SiteController {

    refreshtoken = async (req, res) => {
        try {
            let refreshTokens = await refreshTokenDb.find({});
            let refreshTokenArray = refreshTokens.map(token => token.refreshToken);
            if (!req.body.refreshToken) {
                return res.status(400).json({
                    errCode: 1,
                    message: 'Data is null',
                    data: null,
                });
            }
            const refreshToken = req.body.refreshToken;

            if (!refreshTokenArray.includes(refreshToken)) {
                return res.sendStatus(403);
            }
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {

                if (err) {
                    return res.status(401).send(err);
                }
                const accessToken = jwt.sign({
                    _id: data._id,
                    role: data.role,
                    name: data.name,
                    avatar: data.avatarCloud
                }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' });
                return res.status(200).json(accessToken);

            })
        } catch (error) {
            console.error(error);  // Sử dụng console.error để in rõ ràng lỗi
            res.status(500).json({ error: error.message });
        }
    }

    login = async (req, res) => {
        try {

            const response = await SiteService.login(req.body);
            if (response.data) {
                let playLoad = {
                    _id: response.data._id,
                    role: response.data.role,
                    userName: response.data.userName,
                    avatar: response.data.avatarCloud

                };

                const accessToken = jwt.sign(playLoad, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' });
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
            const response = await SiteService.logout(req.body);
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
module.exports = new SiteController();