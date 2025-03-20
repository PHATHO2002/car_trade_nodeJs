const userService = require('../service/userService');

require('dotenv').config();

class UserController {
    create = async (req, res) => {
        try {
            const response = await userService.create(req.body);
            res.status(response.status).json(response);
        } catch (error) {
            console.error(error); // Sử dụng console.error để in rõ ràng lỗi
            res.status(500).json({ message: 'server error' });
        }
    };

    delete = async (req, res) => {
        try {
            const response = await userService.deletePost(req.userId, req.body); //req.userId lấy trong middleware authentoken
            res.status(response.status).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    };

    update = async (req, res) => {
        try {
            const response = await userService.update(req.userId, req.body);
            res.status(response.status).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    };

    get = async (req, res) => {
        try {
            const response = await userService.get(req.query);
            res.status(response.status).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    };
}
module.exports = new UserController();
