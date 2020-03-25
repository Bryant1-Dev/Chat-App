import React, {createContext, useReducer, useContext, useEffect, useState} from 'react'

export const NotificationContext = createContext();

//This is an example of what our state could look like
const initState = {
    'notificaiton1Id': {
        sender: {
            name: 'Bob',
            profileImage: 'BLOB',
            id: '4'
        },
        recipient: {
            name: 'Steven',
            profileImage: 'BLOB',
            id: '7'
        },
        chat: {
            id: '10',
            name: 'general',
            profileImage: 'BLOB'
        },
        data: {
            notificationId: '3',
            isRecipient: 'BOOLEAN',
            isSender: '!BOOLEAN',
            type: 'chat-invite',
            status: '[pending, denied, status]',
            message: ['${sender.name} invited you to ${chat.name}!', 'Your invitation to ${recipient.name} for the room ${chat.name} is pending...', //pending - (recipeint / sender)
                    '${recipient.name} has accepted your chat invitation to ${chat.name}!', '${recipient.name} has denied your chat invitation to ${chat.name}.'] // (accpted/denied)
        }
    },
} 

function reducer(state, action) {
    const {notification} = action.payload;
    switch(action.type) {
        case 'LOAD_NOTIFICATIONS': 
            console.log('load_notifications')
            return action.payload;
        case 'RECEIVE_NOTIFICATION': 
            console.log('recieve_notificaiton')
            const clonedState = {...state};
            clonedState[notification.data.notificaitonId] = notification; 
            return clonedState;
        default: 
            console.log('default - notification')
            return state;
    }
}




export default function NotificationStore(props) {
    const [allNotifications, dispatch] = useReducer(reducer, null);

    return (
        <NotificationContext.Provider value={{allNotifications, notificationDispatch: dispatch}}>
            {props.children}
        </NotificationContext.Provider>
    )
}
