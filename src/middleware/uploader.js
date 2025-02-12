const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

// Cấu hình lưu trữ Multer trên Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'car_imgs', // Thư mục trên Cloudinary
        allowed_formats: ['jpg', 'png'], // Định dạng ảnh cho phép
        transformation: [{ width: 500, height: 500, crop: 'limit' }], // Resize ảnh nếu cần
    },
});

// Middleware kiểm tra số lượng ảnh trước khi upload
const uploadCloud = (req, res, next) => {
    const upload = multer({ storage }).array('images', 10); // Giới hạn 10 ảnh

    upload(req, res, (err) => {
        if (err instanceof multer.MulterError && err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ message: 'Chỉ được upload tối đa 10 ảnh!' });
        }
        if (err) {
            return res.status(500).json({ message: 'Lỗi upload ảnh', error: err.message });
        }
        next();
    });
};

module.exports = uploadCloud;
