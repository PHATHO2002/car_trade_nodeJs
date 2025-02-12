require('dotenv').config();
const jwt = require('jsonwebtoken');

function authenAdmin(req, res, next) {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
        return res.sendStatus(401); // Không có token
    }
    // 'Bearer [token]'
    const token = authorizationHeader.split(' ')[1];

    // Giải mã token để lấy thông tin payload
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) {
            return res.status(401).send('Token không hợp lệ'); // Token không hợp lệ
        }

        // Kiểm tra xem người dùng có vai trò admin không
        if (data.role !=='admin' ) {
            return res.status(403).send('Bạn không có quyền truy cập'); // Không có quyền
        }

        // Nếu tất cả đều đúng, tiếp tục
        next();
    });
}

module.exports = authenAdmin;
