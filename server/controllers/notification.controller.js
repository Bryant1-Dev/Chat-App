const { Op } = require("sequelize");
const {User, Notification, Chat, Message, ChatParticipant, FriendRequest} = require('../models/test.js');


exports.retrieveUserNotifications = async (req, res) => {
    const {userId} = req.body;
    
    try {
       const notifications = await Notification.findAll({
            where: {
                [Op.or]: [
                    {senderId: userId},
                    {recipientId: userId}
                ]
            }
        });

        if(notifications.length == 0) return res.send({
            success: true,
            payload: {
                notifications: {}
            }
        });

        const notificationData = {};
        
        for (notifications of notification) {
            
            const sender = await User.findOne({where: {id: notification.senderId}});
            const recipient = await User.findOne({where: {id: notification.recipientId}});
            const isSender = notification.senderId === userId;
            const isRecipient = !isSender;
            
            if(notification.type.trim().toLowerCase() == 'chat-invite') {
                if(notification.status.trim().toLowerCase() != 'pending' && isRecipient) {
                    
                    const chat = await Chat.findOne({where: {id: notification.chatId}}) 
            
                    const data = {
                        sender : {
                            socketId: sender.socketId,
                            isOnline: sender.isOnline,
                            name: sender.username,
                            id: sender.id,
                            profileImage: sender.profileImage
                        },
                        recipient : {
                            socketId: recipient.socketId,
                            isOnline: recipient.isOnline,
                            name: recipient.username,
                            id: recipient.id,
                            profileImage: recipient.profileImage
                        },
                        chat:  {
                            id: chat.id,
                            name: chat.name,
                            profileImage: chat.profileImage
                        },
                        data: {
                            type: notification.type, 
                            status: notification.status,
                            isSender,
                            isRecipient,
                            notificationId: notification.id
                        }
                
                    }

                    notificationData[notification.id] = data;
                    continue;
                }
                
            }
        } //end of for-loop

        return res.send({ 
            success: true, 
            payload: {
                notifications: notificationData
            }
        })


    }

    catch (error) {
        res.send({
            success: false,
            error: 'Database error'
        })
    }
}