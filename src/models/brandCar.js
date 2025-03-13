const mongoose = require('mongoose');
const carBrand = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    logo: { type: String, required: true, trim: true },
});
module.exports = mongoose.model('carBrand', carBrand);
