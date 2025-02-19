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
            const response = await userService.postTradeCar(req.userId, req.files, req.username, req.body);
            res.status(response.status).json(response);
        } catch (error) {
            console.error(error); // Sử dụng console.error để in rõ ràng lỗi
            res.status(500).json({ message: 'server error' });
        }
    };
    getApprovaledCar = async (req, res) => {
        try {
            const response = await userService.getApprovaledCar();
            res.status(response.status).json(response);
        } catch (error) {
            console.error(error); // Sử dụng console.error để in rõ ràng lỗi
            res.status(500).json({ error: error.message });
        }
    };
    getCart = async (req, res) => {
        try {
            const response = await userService.getCart(req.userId, req.body);
            res.status(response.status).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    };
    addToCart = async (req, res) => {
        try {
            const response = await userService.addToCart(req.userId, req.body); //req.userId lấy trong middleware authentoken
            res.status(response.status).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    };
    chatTwo = async (req, res) => {
        try {
            const response = await userService.chatTwo(req.userId, req.body); //req.userId lấy trong middleware authentoken
            res.status(response.status).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    };
    getMessage = async (req, res) => {
        try {
            const response = await userService.getMessage(req.userId, req.body); //req.userId lấy trong middleware authentoken
            res.status(response.status).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    };
    deleteItemInCart = async (req, res) => {
        try {
            const response = await userService.deleteItemInCart(req.userId, req.body);
            res.status(response.status).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    };
}
module.exports = new UserController();
