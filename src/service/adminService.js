class AdminService {

    addProduct = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { title, description, category, price, stock, brand, image } = data;

                // Kiểm tra title
                if (!title || typeof title !== 'string' || title.trim() === '') {
                    return resolve({
                        errCode: 1,
                        message: 'Title is required and must be a non-empty string.',
                        data: null,
                    });
                }

                // Kiểm tra description
                if (!description || typeof description !== 'string' || description.trim() === '') {
                    return resolve({
                        errCode: 1,
                        message: 'Description is required and must be a non-empty string.',
                        data: null,
                    });
                }

                // Kiểm tra category
                if (!category || typeof category !== 'string' || category.trim() === '') {
                    return resolve({
                        errCode: 1,
                        message: 'Category is required and must be a non-empty string.',
                        data: null,
                    });
                }

                // Kiểm tra price
                const priceNumber = Number(price);
                if (isNaN(priceNumber) || priceNumber <= 0) {
                    return resolve({
                        errCode: 1,
                        message: 'Price is required and must be a positive number.',
                        data: null,
                    });
                }

                // Kiểm tra stock
                const stockNumber = Number(stock);
                if (isNaN(stockNumber) || !Number.isInteger(stockNumber) || stockNumber < 0) {
                    return resolve({
                        errCode: 1,
                        message: 'Stock is required and must be a non-negative integer.',
                        data: null,
                    });
                }

                // Kiểm tra brand
                if (!brand || typeof brand !== 'string' || brand.trim() === '') {
                    return resolve({
                        errCode: 1,
                        message: 'Brand is required and must be a non-empty string.',
                        data: null,
                    });
                }

                // Kiểm tra image
                if (!image || typeof image !== 'string' || image.trim() === '') {
                    return resolve({
                        errCode: 1,
                        message: 'Image is required and must be a non-empty string.',
                        data: null,
                    });
                }

                // Tạo sản phẩm mới
                const newProduct = new productSchema({
                    title,
                    description,
                    category,
                    price: priceNumber,  // Lưu giá trị price đã chuyển đổi
                    stock: stockNumber,   // Lưu giá trị stock đã chuyển đổi
                    brand,
                    image
                });

                // Lưu sản phẩm vào cơ sở dữ liệu
                await newProduct.save();
                return resolve({
                    errCode: 0,
                    message: 'Add new product successfully!',
                    data: { title, description, category, price: priceNumber, stock: stockNumber, brand, image },
                });

            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = new AdminService();
