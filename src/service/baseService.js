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
    validateId = (id) => {
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return 'id không hợp lệ.';
        }
        return false;
    };
    validateCarData = (data) => {
        if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 5) {
            return 'Tiêu đề phải là chuỗi có ít nhất 5 ký tự.';
        }

        const price = Number(data.price); // Chuyển đổi price sang number trước khi kiểm tra
        if (isNaN(price) || price <= 0) {
            return 'Giá bán phải là số và lớn hơn 0.';
        }

        if (!data.description || typeof data.description !== 'string' || data.description.trim().length < 10) {
            return 'Mô tả phải có ít nhất 10 ký tự.';
        }

        if (!data.address || typeof data.address !== 'string' || data.address.trim().length === 0) {
            return 'Địa chỉ không được để trống.';
        }

        return false;
    };
}

module.exports = BaseService;
