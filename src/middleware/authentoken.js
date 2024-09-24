require('dotenv').config();
const jwt = require('jsonwebtoken');

function authenToken(req, res, next) {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
        return res.sendStatus(401);
    }
    //'Beaer [tonken]'
    const token = authorizationHeader.split(' ')[1];

    jwt.verify(token, process.env.ACSSES_TOKEN_SECRET, (err, data) => {

        if (err) {
            return res.status(401).send(err);
        }

        next()
    })
}
module.exports = authenToken;