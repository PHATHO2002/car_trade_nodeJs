const userService = require('../service/userService')
class SiteController {
    //get
    async getHome(req, res) {
        try {
            const respone = await userService.getUser();
            return res.status(200).json(respone);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);

        }

    }

}
module.exports = new SiteController();