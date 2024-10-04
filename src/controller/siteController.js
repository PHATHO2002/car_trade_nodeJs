
const jwt = require('jsonwebtoken');
const refreshTokenDb = require('../model/refeshToken');

require('dotenv').config();



class SiteController {

    refreshtoken = async (req, res) => {
        try {
            let refreshTokens = await refreshTokenDb.find({});
            let refreshTokenArray = refreshTokens.map(token => token.refreshToken);

            const refreshToken = req.body.refreshToken;
            console.log(refreshToken)
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
                }, process.env.ACSSES_TOKEN_SECRET, { expiresIn: '60s' });
                return res.status(200).json(accessToken);

            })
        } catch (error) {
            console.error(error);  // Sử dụng console.error để in rõ ràng lỗi
            res.status(500).json({ error: error.message });
        }
    }



}
module.exports = new SiteController();