const axios = require('axios');
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

        if (data.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
            return 'Email không hợp lệ.';
        }

        return false;
    };
}

module.exports = BaseService;
