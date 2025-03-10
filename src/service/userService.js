const BaseService = require('./baseService');
const userSchema = require('../models/user');
const pendingCarSchema = require('../models/pendingCar');
const cartSchema = require('../models/Cart');
const chatSchema = require('../models/chat');
const { ObjectId } = require('mongodb');

class UserService extends BaseService {
    constructor() {
        super();
    }
    createNewUser = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { username, password } = data || {};
                if (
                    !username ||
                    typeof username !== 'string' ||
                    username.trim() === '' ||
                    !password ||
                    typeof password !== 'string' ||
                    password.trim() === ''
                ) {
                    return resolve(errorResponse(400, 'Invalid username and password'));
                }
                // Kiểm tra xem người dùng đã tồn tại chưa
                const existingUser = await userSchema.findOne({
                    username: username,
                });
                if (existingUser) {
                    return resolve(this.errorResponse(400, 'Username already exists! please chose another name'));
                }

                const newUser = new userSchema({ username, password, role: 'user' });
                await newUser.save();
                const userId = newUser._id;
                const newCart = new cartSchema({ userId, carIds: [] });
                await newCart.save();
                return resolve(this.successResponse('User registered successfully!'));
            } catch (error) {
                reject(error);
            }
        });
    };
    postTradeCar = (userId, files, username, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const err = this.validateCarData(data);
                if (err) return resolve(this.errorResponse(400, err));
                const imageUrls = files.map((file) => file.path);
                const userIdexist = await userSchema.findById(userId);
                if (!userIdexist) {
                    return resolve(this.errorResponse(400, `không tồndd tại user id ${userId}`));
                }
                const newPendingCar = new pendingCarSchema({
                    title: data.title,
                    price: data.price,
                    description: data.description,
                    address: data.address,
                    sellerName: username,
                    sellerId: userId,
                    images: imageUrls, // Lưu danh sách URL ảnh từ Cloudinary
                    status: 'pending',
                });
                await newPendingCar.save();
                return resolve(this.successResponse('đăng tin bán xe thành công!', newPendingCar));
            } catch (error) {
                reject(error);
            }
        });
    };
    getApprovaledCar = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const approvaledCars = await pendingCarSchema.find({ status: 'accepted' });
                if (approvaledCars.length === 0) return resolve(this.errorResponse(400, 'empty approvaledCars'));
                return resolve(this.successResponse('get Approval car success ', approvaledCars));
            } catch (error) {
                reject(error);
            }
        });
    };
    addToCart = (userId, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.validateId(userId)) {
                    return resolve(this.errorResponse(400, 'userId không hợp lệ'));
                }
                if (this.validateId(data.carId)) {
                    return resolve(this.errorResponse(400, 'carId không hợp lệ'));
                }
                await cartSchema.findOneAndUpdate(
                    { userId: userId }, // Điều kiện tìm
                    { $push: { carIds: data.carId } }, // Dữ liệu cần cập nhật
                    { new: true, runValidators: true }, // Tùy chọn
                );
                return resolve(this.successResponse('add to cart success '));
            } catch (error) {
                reject(error);
            }
        });
    };
    deleteItemInCart = (userId, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.validateId(userId)) {
                    return resolve(this.errorResponse(400, 'userId không hợp lệ'));
                }
                if (this.validateId(data.carId)) {
                    return resolve(this.errorResponse(400, 'carId không hợp lệ'));
                }

                const result = await cartSchema.updateOne(
                    { userId: userId },
                    { $pull: { carIds: new ObjectId(data.carId) } },
                );
                if (!result) return resolve(this.errorResponse(400, 'no exits userId'));
                return resolve(this.successResponse('delete item in cart success ', result));
            } catch (error) {
                reject(error);
            }
        });
    };
    deletePost = (userId, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.validateId(data.carId)) {
                    return resolve(this.errorResponse(400, 'carId không hợp lệ'));
                }
                const deletedPost = await pendingCarSchema.findOneAndDelete({
                    sellerId: userId,
                    _id: data.carId,
                });
                if (deletedPost) {
                    return resolve(this.successResponse('Xóa bài đăng thành công', deletedPost));
                } else {
                    return resolve(this.errorResponse(404, 'Không tìm thấy bài đăng'));
                }
            } catch (error) {
                reject(error);
            }
        });
    };

    getCart = (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.validateId(userId)) {
                    return resolve(this.errorResponse(400, this.validateId(userId)));
                }
                const carts = await cartSchema
                    .findOne(
                        { userId: userId }, // Tùy chọn
                    )
                    .populate('carIds')
                    .exec();
                return resolve(this.successResponse('get carts car success ', carts));
            } catch (error) {
                reject(error);
            }
        });
    };
    chatTwo = (userId, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { receiverId, message } = data || {};
                if (this.validateId(userId)) {
                    return resolve(this.errorResponse(400, 'senderId không hợp lệ'));
                }
                if (this.validateId(receiverId)) {
                    return resolve(this.errorResponse(400, 'receiverId không hợp lệ'));
                }
                if (!message) {
                    return resolve(this.errorResponse(400, 'empty mess'));
                }
                const newChat = new chatSchema({ senderId: userId, receiverId: receiverId, message: message });
                await newChat.save();
                return resolve(this.successResponse('send mess success ', newChat));
            } catch (error) {
                reject(error);
            }
        });
    }; // send mes beetween two people

    getMessage = (userId, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { receiverId } = data || {};
                if (this.validateId(userId)) {
                    return resolve(this.errorResponse(400, 'senderId không hợp lệ'));
                }
                if (this.validateId(receiverId)) {
                    return resolve(this.errorResponse(400, 'receiverId không hợp lệ'));
                }
                const messages = await chatSchema.find({
                    $or: [
                        { senderId: userId, receiverId: receiverId },
                        { senderId: receiverId, receiverId: userId },
                    ],
                });

                return resolve(this.successResponse('get messages successfuly ', messages));
            } catch (error) {
                reject(error);
            }
        });
    };

    getPosts = (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const pendingCars = await pendingCarSchema.find({ sellerId: userId });
                return resolve(this.successResponse('get post success ', pendingCars));
            } catch (error) {
                reject(error);
            }
        });
    };
    markReadedMess = (userId, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                data.unReadedMess.forEach(async (id) => {
                    await chatSchema.findOneAndUpdate(
                        {
                            $and: [
                                { _id: id },
                                {
                                    receiverId: userId,
                                },
                            ],
                        },
                        { isRead: true },
                        { new: true },
                    );
                });
                return resolve(this.successResponse('update readed success '));
            } catch (error) {
                reject(error);
            }
        });
    };

    updateUser = (userId, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const updateData = {};
                if (data.phone) updateData.phone = data.phone;
                if (data.email) updateData.email = data.email;
                if (data.address) {
                    updateData.address = {};

                    if (data.address.province) {
                        updateData.address.province = {
                            code: data.address.province.code || '',
                            name: data.address.province.name || '',
                        };
                    }
                    if (data.address.district) {
                        updateData.address.district = {
                            code: data.address.district.code || '',
                            name: data.address.district.name || '',
                        };
                    }
                    if (data.address.ward) {
                        updateData.address.ward = {
                            code: data.address.ward.code || '',
                            name: data.address.ward.name || '',
                        };
                    }
                }
                const err = this.validateUserData(updateData);
                if (err) return resolve(this.errorResponse(400, err));
                const userUpdated = await userSchema.findOneAndUpdate(
                    { _id: userId },
                    { $set: updateData },
                    { returnDocument: 'after' },
                );
                return resolve(this.successResponse('update exits user infor success ', userUpdated));
            } catch (error) {
                reject(error);
            }
        });
    };
    getUnReadMess = (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const messages = await chatSchema
                    .find({
                        receiverId: userId,
                        isRead: false,
                    })
                    .sort({ createdAt: -1 });
                return resolve(this.successResponse('get list mess unread success ', messages));
            } catch (error) {
                reject(error);
            }
        });
    };
    getListChatPartner = (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const messages = await chatSchema
                    .find({
                        $or: [{ senderId: userId }, { receiverId: userId }],
                    })
                    .sort({ createdAt: -1 });

                const listPartner = [];

                messages.forEach((mess) => {
                    let { senderId, receiverId } = mess;
                    senderId = senderId.toString();
                    receiverId = receiverId.toString();
                    let id;
                    if (senderId === userId) {
                        if (receiverId == userId) {
                            id = senderId; // case chat yourseft
                        } else {
                            id = receiverId;
                        }
                    } else {
                        id = senderId;
                    }
                    if (id)
                        if (!listPartner.some((item) => item.id == id))
                            listPartner.push({ id, senderId: mess.senderId, mess: mess.message, isRead: mess.isRead });
                });
                let newlistPartner = await Promise.all(
                    listPartner.map(async (item) => {
                        let name = await userSchema.findOne({ _id: item.id }, { username: 1, _id: 0 });
                        if (name) {
                            item.name = name.username;
                        } else {
                            item.name = 'unknow';
                        }
                        return item;
                    }),
                );
                return resolve(this.successResponse('get list partner success ', newlistPartner));
            } catch (error) {
                reject(error);
            }
        });
    };
    search = (query) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!query.trim()) return resolve(this.errorResponse(400, 'query empty'));
                const response = await pendingCarSchema.find({
                    $and: [{ title: { $regex: query, $options: 'i' } }, { status: 'accepted' }],
                });
                return resolve(this.successResponse('search success ', response));
            } catch (error) {
                reject(error);
            }
        });
    };
    getUserOwnPosts = (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const rp = await pendingCarSchema.find({
                    sellerId: userId,
                });
                return resolve(this.successResponse('get User Own osts success ', rp));
            } catch (error) {
                reject(error);
            }
        });
    };
    getDetailUser = (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const rp = await userSchema.findOne({ _id: userId }).select('-password');
                return resolve(this.successResponse('get User detail success ', rp));
            } catch (error) {
                reject(error);
            }
        });
    };
}
module.exports = new UserService();
