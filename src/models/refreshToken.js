const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema cho RefreshToken (Tham chiếu đến User)
const refreshTokenSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Tham chiếu đến User
        required: true,
    },
    refreshToken: {
        type: String,
    },
});

module.exports = mongoose.model('refreshTokens', refreshTokenSchema, 'refreshTokens');
