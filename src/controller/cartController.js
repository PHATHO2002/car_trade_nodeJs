const CartService = require('../service/cartService');

require('dotenv').config();

class CartController {
    get = async (req, res) => {
        try {
            const response = await CartService.get(req.userId);
            res.status(response.status).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    };
    add = async (req, res) => {
        try {
            const response = await CartService.add(req.userId, req.body); //req.userId lấy trong middleware authentoken
            res.status(response.status).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    };
    delete = async (req, res) => {
        try {
            const { id } = req.params;
            const response = await CartService.delete(req.userId, id);
            res.status(response.status).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    };
}
module.exports = new CartController();
