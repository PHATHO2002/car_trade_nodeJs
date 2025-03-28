const adminService = require('../service/adminService');

require('dotenv').config();

class AdminController {
    getPendingCars = async (req, res) => {
        try {
            const response = await adminService.getPendingCars();
            res.status(200).json(response);
        } catch (error) {
            console.error(error); // Sử dụng console.error để in rõ ràng lỗi
            res.status(500).json({ error: error.message });
        }
    };
    decisionPendingCar = async (req, res) => {
        try {
            const response = await adminService.decisionPendingCar(req.body);
            res.status(200).json(response);
        } catch (error) {
            console.error(error); // Sử dụng console.error để in rõ ràng lỗi
            res.status(500).json({ error: error.message });
        }
    };
    getBrandCountByMonth = async (req, res) => {
        try {
            const { month, year } = req.query;
            const response = await adminService.getBrandCountByMonth(month, year);
            res.status(200).json(response);
        } catch (error) {
            console.error(error); // Sử dụng console.error để in rõ ràng lỗi
            res.status(500).json({ error: error.message });
        }
    };
}
module.exports = new AdminController();
