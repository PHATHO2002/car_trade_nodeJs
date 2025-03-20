const mongoose = require('mongoose');
const carBrandSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    logo: { type: String, required: true, trim: true },
},{ collection: 'carBrand' });
module.exports = mongoose.model('carBrand', carBrandSchema);
