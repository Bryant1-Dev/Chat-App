const Sequelize = require('sequelize');
const {db} = require('../config/database');



const User = db.define('users', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    username: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.DataTypes.STRING,
        unique: true
    },
    password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    socketId: {
        type: Sequelize.DataTypes.STRING
    },
    isOnline: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false
    },
    profileImage: {
        type: Sequelize.DataTypes.BLOB
    },
    settings: {
        type: Sequelize.DataTypes.JSON
    }
})

const Chat = db.define('chats', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    profileImage: {
        type: Sequelize.DataTypes.BLOB
    },
    settings: {
        type: Sequelize.DataTypes.JSON
    }
})

const FriendRequest = db.define('friendRequests', {
    senderId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
        model: 'User', 
        key: 'id'
        }
    },
    recipientId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
        model: 'User', 
        key: 'id'
        }
    },
    status: {
        type: Sequelize.DataTypes.ENUM,
        values: ['pending', 'accepted']
    }

})

User.belongsToMany(User, { as: { singular: 'friend', plural: 'friends' }, through: 'FriendRequests' })



const ChatParticipant = db.define('chatParticipants', {
    userId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
        model: User,
        key: 'id'
        }
    },
    chatId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
        model: Chat, 
        key: 'id'
        }
    },
    isMuted: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false
    },
    wantsNotifications: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: true
    },
    permissions: {
        type: Sequelize.DataTypes.ENUM({
            values: ['user ', 'admin', 'owner']
        }),
        defaultValue: 'user'
    }
});

//Users that are in the chat
User.belongsToMany(Chat, { as: { singular: 'chat', plural: 'chats' }, through: 'chatParticipants', foreignKey: 'userId' })
Chat.belongsToMany(User, { as: { singular: 'participant', plural: 'participants' }, through: 'chatParticipants', foreignKey: 'chatId' })

//People a user has muted
User.belongsToMany(User, { as: { singular: 'mutedMember', plural: 'mutedMembers' }, through: 'PersonalMutedUsers' })


//messages
const Message = db.define('messages', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    text: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false 
    },
    chatName: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
            model: Chat, // 'Movies' would also work
            key: 'id'
        }
  },
  sender: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
            model: User, 
            key: 'id'
        }
  }
});

Message.belongsTo(Chat, {
    foreignKey: 'chatId'
});

Chat.hasMany(Message, {
    foreignKey: 'messageId'
});

//Notifications 
const Notification = db.define('notifications', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    senderId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
        model: 'User', 
        key: 'id'
        }
    },
    recipientId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
        model: 'User', 
        key: 'id'
        }
    },
    status: {
        type: Sequelize.DataTypes.ENUM,
        values: ['pending', 'denied', 'accepted'],
        allowNull: false
    },
    text: {
        type: Sequelize.DataTypes.STRING
    },
    type: {
    	type: Sequelize.DataTypes.STRING,
        allowNull: false 
    },
    chatId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
            model: Chat, 
            key: 'id'
        }
  }
});

Notification.belongsTo(User, {
    foreignKey: 'id'
});

User.hasMany(Notification, {
    foreignKey: 'id'
});

module.exports = {User, Notification, Chat, Message, ChatParticipant, FriendRequest};