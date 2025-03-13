const CarService = require('../service/carService');

require('dotenv').config();

class CarController {
    getBrandsOfCar = async (req, res) => {
        try {
            const response = await CarService.postTradeCar();
            res.status(response.status).json(response);
        } catch (error) {
            console.error(error); // Sử dụng console.error để in rõ ràng lỗi
            res.status(500).json({ message: 'server error' });
        }
    };
    postTradeCar = async (req, res) => {
        try {
            const response = await CarService.postTradeCar(req.userId, req.files, req.username, req.body);
            res.status(response.status).json(response);
        } catch (error) {
            console.error(error); // Sử dụng console.error để in rõ ràng lỗi
            res.status(500).json({ message: 'server error' });
        }
    };
    getApprovaledCar = async (req, res) => {
        try {
            const response = await CarService.getApprovaledCar();
            res.status(response.status).json(response);
        } catch (error) {
            console.error(error); // Sử dụng console.error để in rõ ràng lỗi
            res.status(500).json({ error: error.message });
        }
    };
    search = async (req, res) => {
        try {
            const { slug } = req.params;
            const response = await CarService.search(slug);
            res.status(response.status).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    };
}
module.exports = new CarController();
