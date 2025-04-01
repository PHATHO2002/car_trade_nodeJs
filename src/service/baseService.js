const axios = require('axios');
const connectOrReturnRedis = require('../config/redis');
class BaseService {
    successResponse(message, data = null, status = 200) {
        return {
            status,
            message,
            data,
        };
    }

    errorResponse(status, message, data = null) {
        return {
            status,
            message,
            data,
        };
    }
    sendEmail = (senderEmail, senderName, recipientEmail, recipientName, subject, htmlContent) => {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    process.env.API_SEND_EMAIL, // API URL từ biến môi trường
                    {
                        sender: {
                            email: senderEmail,
                            name: senderName,
                        },
                        to: [
                            {
                                email: recipientEmail,
                                name: recipientName,
                            },
                        ],
                        subject: subject,
                        htmlContent: htmlContent, // Nội dung email truyền vào
                    },
                    {
                        headers: {
                            'api-key': process.env.BREVO_API_KEY, // API Key từ biến môi trường
                        },
                    },
                )
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };
    // handle redis
    storeInRedis = async (key, value, ttl = null) => {
        return new Promise(async (resolve, reject) => {
            try {
                const redis = await connectOrReturnRedis();

                if (ttl === null) {
                    await redis.set(key, value); // Lưu key mà không có thời gian sống

                    resolve('Lưu thành công ');
                } else {
                    await redis.set(key, value);
                    await redis.expire(key, ttl); // Set TTL cho key
                    resolve('Lưu thành công ');
                }
            } catch (error) {
                reject(error);
            }
        });
    };
    checkInRedis = async (key, valueCheck, nameofValue) => {
        return new Promise(async (resolve, reject) => {
            try {
                const redis = await connectOrReturnRedis();
                const value = await redis.get(key);
                if (!value) {
                    return reject(`Không tìm thấy  ${nameofValue} trong Redis.`);
                }
                if (value !== valueCheck) {
                    return reject(`Giá trị ${nameofValue} không chính xác.`);
                }
                const ttl = await redis.ttl(key); // Lấy TTL của key

                if (ttl <= 0) {
                    return reject(` ${nameofValue} đã hết hạn `);
                }
                resolve(value);
            } catch (error) {
                reject(error);
            }
        });
    };

    // validate
    validateId = (id) => {
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return 'id không hợp lệ.';
        }
        return false;
    };

    validateCarData = (data) => {
        if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 2) {
            return 'Tên xe phải có ít nhất 2 ký tự.';
        }

        if (!data.brand || typeof data.brand !== 'string' || data.brand.trim().length < 2) {
            return 'Hãng xe phải có ít nhất 2 ký tự.';
        }

        const year = Number(data.year);
        const currentYear = new Date().getFullYear();
        if (isNaN(year) || year < 1886 || year > currentYear) {
            // 1886 là năm sản xuất xe đầu tiên
            return `Năm sản xuất phải từ 1886 đến ${currentYear}.`;
        }

        const mileage = Number(data.mileage);
        if (isNaN(mileage) || mileage < 0) {
            return 'Số km đã đi phải là số và không được âm.';
        }

        if (!data.condition || typeof data.condition !== 'string') {
            return 'Tình trạng xe phải là một chuỗi.';
        }

        const price = Number(data.price);
        if (isNaN(price) || price <= 0) {
            return 'Giá bán phải là số và lớn hơn 0.';
        }

        if (!data.description || typeof data.description !== 'string' || data.description.trim().length < 10) {
            return 'Mô tả phải có ít nhất 10 ký tự.';
        }

        return false; // Không có lỗi
    };

    validateUserData = (data) => {
        if (data.phone && !/^\d{10,11}$/.test(data.phone)) {
            return 'Số điện thoại phải có 10-11 chữ số.';
        }
        if (
            data.email &&
            (data.email.indexOf('@') === -1 ||
                data.email.indexOf('.') === -1 ||
                data.email.indexOf('@') > data.email.indexOf('.'))
        ) {
            return 'Email không hợp lệ...';
        }
        if (data.username && /\s/.test(data.username)) {
            return 'Tên đăng nhập không được có khoảng trắng.';
        }
        if (data.password && data.password.trim().length < 6) {
            return 'Mật khẩu phải có ít nhất 6 ký tự.';
        }

        return false;
    };
}

module.exports = BaseService;
