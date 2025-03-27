const CarService = require('../service/carService');

require('dotenv').config();

class CarController {
    getBrandsOfCar = async (req, res) => {
        try {
            const response = await CarService.getBrands();
            res.status(response.status).json(response);
        } catch (error) {
            console.error(error); // Sử dụng console.error để in rõ ràng lỗi
            res.status(500).json({ message: 'server error' });
        }
    };
    create = async (req, res) => {
        try {
            const response = await CarService.create(req.userId, req.files, req.username, req.body);
            res.status(response.status).json(response);
        } catch (error) {
            console.error(error); // Sử dụng console.error để in rõ ràng lỗi
            res.status(500).json({ message: 'server error' });
        }
    };
    get = async (req, res) => {
        try {
            const response = await CarService.get(req.query);
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
    //just update saleStatus
    update_saleStatus = async (req, res) => {
        try {
            const { id } = req.params;
            const response = await CarService.update_saleStatus(req.userId, id, req.body);
            res.status(response.status).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    };
    delete = async (req, res) => {
        try {
            const { id } = req.params;
            const response = await CarService.delete(req.userId, id); //req.userId lấy trong middleware authentoken
            res.status(response.status).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    };
}
module.exports = new CarController();
