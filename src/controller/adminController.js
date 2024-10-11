const adminService = require('../service/adminService');
const jwt = require('jsonwebtoken');

require('dotenv').config();

class AdminController {


    addProduct = async (req, res) => {
        try {
            if (req.file) {
                req.body.image = req.file.path;
            }
            const response = await adminService.addProduct(req.body);
            switch (response.errCode) {
                case 1:
                    return res.status(400).json(response);
                    break;

                default:
                    return res.status(200).json(response);
                    break;
            }
        } catch (error) {
            console.error(error);  // Sử dụng console.error để in rõ ràng lỗi
            res.status(500).json({ error: error.message });
        }
    }


}
module.exports = new AdminController();