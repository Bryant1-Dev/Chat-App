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
            chatName: chatRoom.name
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
                    userId: chat.chatParticipants.userId
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
                    userId: user.chatParticipants.userId
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

