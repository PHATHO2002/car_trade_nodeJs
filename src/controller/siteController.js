const userService = require('../service/userService');
const jwt = require('jsonwebtoken');
const refreshTokenDb = require('../model/refeshToken');

require('dotenv').config();

class BaseController {


    handleError(error, res) {
        console.error(error);  // Sử dụng console.error để in rõ ràng lỗi
        res.status(500).json({ error: error.message });
    }

}

class SiteController extends BaseController {


    getAllUser = async (req, res) => {
        try {
            const response = await userService.getAllUser();
            return res.status(200).json(response);
        } catch (error) {
            this.handleError(error, res);
        }

    }

    getLogin = async (req, res) => {
        try {
            return res.render('loginForm.ejs')
        } catch (error) {
            this.handleError(error, res);
        }
    }
    refreshtoken = async (req, res) => {
        try {
            let refreshtokens = await refreshTokenDb.find({}, 'refreshtoken -_id');
            let refreshTokenArray = refreshtokens.map(token => token.refreshtoken);
            const refreshtoken = req.body.refreshtoken;
            if (!refreshTokenArray.includes(refreshtoken)) {
                return res.sendStatus(403);
            }
            jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {

                if (err) {
                    return res.status(401).send(err);
                }
                const accessToken = jwt.sign({
                    _id: data._id,
                    role: data.role,
                    name: data.name
                }, process.env.ACSSES_TOKEN_SECRET, { expiresIn: '60s' });
                return res.status(200).json(accessToken);

            })
        } catch (error) {
            this.handleError(error, res);
        }
    }
    login = async (req, res) => {
        try {
            const response = await userService.login(req.body);
            if (response.data) {
                let playLoad = {
                    _id: response.data._id,
                    role: response.data.role,
                    name: response.data.name

                };

                const accessToken = jwt.sign(playLoad, process.env.ACSSES_TOKEN_SECRET, { expiresIn: '60s' });
                const refreshtoken = jwt.sign(playLoad, process.env.REFRESH_TOKEN_SECRET);
                await refreshTokenDb.create({
                    refreshtoken: refreshtoken,

                })
                return res.status(200).json({ accessToken, refreshtoken });
            }
            return res.status(400).json(response);
        } catch (error) {
            this.handleError(error, res);
        }
    }

}
module.exports = new SiteController();