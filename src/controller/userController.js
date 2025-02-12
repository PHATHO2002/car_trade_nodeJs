const userService = require('../service/userService');

require('dotenv').config();

class UserController {
    createNewUser = async (req, res) => {
        try {
            const response = await userService.createNewUser(req.body);
            res.status(response.status).json(response);
        } catch (error) {
            console.error(error); // Sử dụng console.error để in rõ ràng lỗi
            res.status(500).json({ message: 'server error' });
        }
    };
    postTradeCar = async (req, res) => {
        try {
            const response = await userService.postTradeCar(req.files, req.body);
            res.status(response.status).json(response);
        } catch (error) {
            console.error(error); // Sử dụng console.error để in rõ ràng lỗi
            res.status(500).json({ message: 'server error' });
        }
    };
}
module.exports = new UserController();
