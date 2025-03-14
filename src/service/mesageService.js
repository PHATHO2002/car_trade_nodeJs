const BaseService = require('./baseService');
const userSchema = require('../models/user');

const chatSchema = require('../models/chat');

class MesageService extends BaseService {
    constructor() {
        super();
    }

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

    getMessageBetWeenTwo = (userId, data) => {
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
}
module.exports = new MesageService();
