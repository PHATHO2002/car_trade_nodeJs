require('dotenv').config();
const jwt = require('jsonwebtoken');

function authenAdmin(req, res, next) {
    const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader) {
        return res.status(401).json({ message: 'Không có token, vui lòng đăng nhập' });
    }

    const token = authorizationHeader.split(' ')[1]; // Lấy token từ header

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'jwt expired' });
            }
            return res.status(403).json({ message: 'Token không hợp lệ' });
        }
        if (decoded.role !== 'admin') {
            return res.status(403).send('Bạn không có quyền truy cập'); // Không có quyền
        }
        req.userId = decoded.userId; // Gán thông tin user vào request
        next();
    });
}

module.exports = authenAdmin;
