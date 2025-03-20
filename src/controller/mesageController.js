const MesageService = require('../service/mesageService');

require('dotenv').config();

class MesageController {
    create = async (req, res) => {
        try {
            const response = await MesageService.chatTwo(req.userId, req.body);

            res.status(response.status).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    };

    get = async (req, res) => {
        try {
            let response;
            if (req.query.receiverId) {
                response = await MesageService.getMessageBetWeenTwo(req.userId, req.query);
            } else if (req.query.unRead) {
                response = await MesageService.getUnReadMess(req.userId);
            }
            if (response.status) {
                return res.status(response.status).json(response);
            }
            return res.status(400).json({ message: 'missing necessary query' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    };
    getPartners = async (req, res) => {
        try {
            const response = await MesageService.getListChatPartner(req.userId);
            res.status(response.status).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    };
    update = async (req, res) => {
        try {
            const response = await MesageService.markReadedMess(req.userId, req.body);
            res.status(response.status).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    };
}
module.exports = new MesageController();
