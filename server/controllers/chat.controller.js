const { Op } = require("sequelize");
const {User, Notification, Chat, Message, ChatParticipant, FriendRequest} = require('../models/test.js');
const users = []

const addUser = async (data) => {
    let {chatId, userId, userPermission} = data;

    try {
        const chatRoom = await Chat.findOne({where: {id: chatId}});
        const currentMembers = await chatRoom.getParticipants();

        let user = currentMembers.find(memeber => member.id === userId);

        if(!user) {
            user = await User.findOne({where: {id: userId}});

            const chatParticipant = {
                isMuted: false,
                wantsNotifications: true,
                permissions: userPermission
            }
        
            chatUser = await chatRoom.addParticipant(user, chatParticipant);
            user = chatUser;
        }

        const chatProfile = {
            name: user.username,
            profileImage: user.profileImage,
            wantsNotifications: user.chatParticipants.wantsNotifications,
            isMuted: user.chatParticipants.isMuted,
            permissions: user.chatParticipants.permissions,
            chatId: user.chatParticipants.chatId,
            userId: user.chatParticipants.userId,
            chatName: chatRoom.name,
            isOnline: user.isOnline
        }
        

        return {user: chatProfile, error: null}
    } 
    
    catch(err) {
        console.log(erorr);
        return {user: null, error}
    }

    

}

/*const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if(index != -1) {
        return users.splice(index, 1)[0];
    }
}*/

exports.getUserInRoom = async (userId, chatId) => {
    
    try {
        const user = await User.findOne({where: {id: userId}});
        
        const userChats = await user.getChats();
        
        const chat = userChats.find(chat => { return chat.id == chatId});
        
        
        if(chat) {
            const chatProfile = {
                    username: user.username,
                    profileImage: user.profileImage,
                    wantsNotifications: chat.chatParticipants.wantsNotifications,
                    isMuted: chat.chatParticipants.isMuted,
                    permissions: chat.chatParticipants.permissions,
                    chatId: chat.chatParticipants.chatId,
                    userId: chat.chatParticipants.userId,
                    isOnline: user.isOnline
            }
            return({user: chatProfile, error: null});
        }
        
        return({user: null, error: null});
    } 
    
    catch(error) {
        console.log(erorr);
        return ({user: null, error})
    }
}

exports.getChatRoom = async (chatId) => {
    try {
        let chatRoom = await Chat.findOne({where: {id: chatId}})
        return({chatRoom, error: null});
    } 
    
    catch(error) {
        console.log(erorr);
        return ({chatRoom: null, error})
    }
}

exports.getUsersInRoom = async (chatId) => {
    try {
        const chatRoom = await Chat.findOne({
            where: {id: chatId},
            include: [{
                model: User, as: 'participants'
            }]
        });
        
        if(chatRoom.participants) {
            const chatMembers = chat.participants.map(user => {
                return {
                    name: user.username,
                    profileImage: user.profileImage,
                    wantsNotifications: user.chatParticipants.wantsNotifications,
                    isMuted: user.chatParticipants.isMuted,
                    permissions: user.chatParticipants.permissions,
                    chatId: user.chatParticipants.chatId,
                    userId: user.chatParticipants.userId,
                    isOnline: user.isOnline
                }
            });

            console.log(`Number of users in the chat: ${chatMembers.length}`)
            
            chatMembers.forEach(member => console.log(JSON.stringify(member)));
            
            return {participants: chatMembers, error: null}
        }
        

         return {particpants: [], error: null};
    } 
    
    catch(error) {
        console.log(error);
        return ({particpants: [], error})
    }
}

/*const getUser = (id) => 
    users.find((user) => user.id === id);*/

/*const getUsersInRoom = (room) => 
    users.filter((user) => user.room === room);*/

exports.retrieveUserChats = async (req, res) => {
    console.log("Reached retrieveUserChats");
    const {userId} = req.body; 
    try {
        const user = await User.findOne({where: {id: userId}});
        
        if(!user) return res.send({success: false, payload: {chats: null, error: `This user does not exist: ${userId}`}});

        const chats = await user.getChats();
        console.log('\nChats: ' + JSON.stringify(chats) + '\n');
         //console.log(chats);
        const userChats = {};
        for(const chat of chats) {
            //console.log('********************************************************test1***********************************************************')
            const participants = await chat.getParticipants();
            //console.log('********************************************************test2***********************************************************')
            const filteredParticipants = participants.map(participant => {
                return {
                    id: participant.id,
                    name: participant.username,
                    profileImage: participant.profileImage,
                    permissions: participant.chatParticipants.permissions
                }
            })
            //remove self from this list?
            userChats[`${chat.id}`] = {
                name: chat.name,
                id: chat.id,
                settings: chat.settings,
                profileImage: chat.profileImage,
                isMuted: chat.chatParticipants.isMuted,
                wantsNotifications: chat.chatParticipants.wantsNotifications,
                permissions: chat.chatParticipants.permissions,
                participants: filteredParticipants,
                messages: []
            }
            console.log('\nuserChats (1st): ' + JSON.stringify(userChats) + '\n');
        }
        
        console.log('\nuserChats(2nd): ' + JSON.stringify(userChats) + '\n');
        
        return res.send({
            success: true,
            payload: {chats: userChats, error: null}
        });
    }

    catch(error) {
        res.send({
            success: false,
            payload: {chats: null, error: error, message: 'catching an error' + userId}
        });
    }
}

//TODO: Add support for profileImages (after finishing up adding chats and inviting users)
exports.createChatRoom = async (req, res) => {

    const {chatName} = req.body;

    console.log('req.body: ' + JSON.stringify(req.body));
    if(!req.body) return res.send({success: false, message: 'The body is empty'})
    try {
        const user = await User.findOne({where: {id: req.user.id}})
        if(!user) {
            return res.send({
                success: false,
                payload: {error: `This user does not exist: ${req.user.id}`}
            })
        }

        const newChat = await Chat.create({
            name: chatName,
            settings: {
                option1: 'default settings'
            }
        });

        const chatParticipantSettings = {
            isMuted: false,
            wantsNotifications: true,
            permissions: 'owner'
        }

        await newChat.addParticipant(user, chatParticipantSettings);
        console.log(`Newly created chat room: ${newChat}`);
        return res.send({
            success: true
        })
    }

    catch(error) {
        res.send({
            success: false,
            payload: {error: error, message: 'database error'}
        })
    }
}

exports.inviteUserToChatRoom = async (req, res) => {
    const {recipientName, chatId, type} = req.body;

    try {
        //ensure a user with recipientName exists
        const recipient = await User.findOne({where: {username: recipientName}});
        if(!recipient) return res.send({success: false, error: `There is no account by the name of ${recipientName}`});
        console.log(`\nChecking recipient from database: ${JSON.stringify(recipient)} \n`);
        //ensure the chat with that id exists
        const chat = await Chat.findOne({where: {id: chatId}});
        console.log(`\nChecking chat from database: ${JSON.stringify(chat)} \n`);
        if(!chat) return res.send({success: false, error: `There is no chat room with id ${chatId}`});
        
        console.log(`\n Checking to see if a previous chat invitation notification already exists... \n`);
        //if there is a user, ensure there is not already a pending notification out before creating a new one
        const previousInviteRequest = await Notification.findOne({
            where: {
                chatId: chatId, 
                senderId: req.user.id, 
                type: type
            }
        });
        
        if(previousInviteRequest) return res.send({success: false, error: `There is already a pending invite request for ${recipientName}`});


        //The text property is useless because a user may change their name and there is no way to reflect that
        //also the text is different depending on not only the status, but also whether the person reading it is the recipient or the sender
        //type should be 'chat-invite', though we get it from the frontend anyway
        const inviteUserSettings = {
            senderId: req.user.id, 
            recipientId: recipient.id, 
            type, 
            status: 'pending',
            chatId: chat.id, 
            text: `${req.user.username} is inviting you to join ${chat.name}!`
        }

        const newNotification = await Notification.create(inviteUserSettings);

        console.log('\n');
        console.log(JSON.stringify(newNotification));
        console.log('\n')

        res.send({success: true, payload: {notification: newNotification}});

    }

    catch(error) {
        console.error(error);
        res.send({
            success: false,
            error: error
        })
    }
}

exports.removeSocketId = async (socketId) => {
    try {
        const user = await User.findOne({where: {socketId: socketId}});
        if(user) {
            user.socketId = '';
            user.isOnline = false;
            await user.save();
            return {user: user, error: null};
        }
    }

    catch(error) {
        return {user: null, error: error};
    }
}

exports.saveSocketId = async (userId, socketId) => {

    try {
        const user = await User.findOne({where: {id: userId}});
        user.socketId = socketId;
        user.isOnline = true;
        await user.save();
        return {user: user, error: null};
    }

    catch(error) {
        return {user: null, error: error};
    }
}

exports.handleChatInvite = async (notification) => {
    const {senderId, recipientId, type, status, chatId, id} = notification;
    
    try {

        /*
            Verify that the sender, recipient, and chat all exists - 
            it's possible the chat has been deleted or one of the accounts have been deleted,
            we also need the database information as well
        */
        if(type.trim().toLowerCase() != 'chat-invite') return {payload: null, error: `This is the incorrect type for this function: ${type}`};
        const sender = await User.findOne({where: {id: senderId}});
        if(!sender) return {payload: null, error: `There is no user by the id: ${senderId}`};
        const recipient = await User.findOne({where: {id: recipientId}});
        if(!recipient) return {payload: null, error: `There is no user by the id: ${recipientId}`};
        const chat = await User.findOne({where: {id: chatId}});
        if(!chat) return {payload: null, error: `There is no chat by the id: ${chatId}`};

        //return socketIds, notification information, and the status if validation passes
        const notificationData = {
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
                type, 
                status,
                isSender: false,
                isRecipient: false,
                notificationId: id
            }
        }

        return {payload: notificationData, error: null};
    }
    catch(error) {
        return {payload: null, error: error};
    }
}
