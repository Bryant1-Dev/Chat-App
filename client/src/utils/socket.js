import {addChatInviteNotificationMessages} from './util';

import io from 'socket.io-client'

let socket = io(':8080');
console.log(`Client has a new socket connection: ${socket.id}`);
let messageData, notificationData;

socket.on('message', (data) => {
    messageData = data;
    messageData.currentTime = Date.now();
    console.log('socket on message: ' + JSON.stringify(messageData));   
})


/*
    Note: For our purposes if the recipient denies or accepts the invitation they will no longer receive the notification
    However, the notification exists in the database until a sender cancels a pending request, or a sender dimisses a 'denied' or 'accepted' notification
*/
socket.on('chat-invite-notification', (payload) => {
    
    notificationData = addChatInviteNotificationMessages(payload);
    notificationData.currentTime = Date.now();

    console.log('socket on chat-invite-notification: ' + JSON.stringify(notificationData));   
})

function sendSocketData() {
    let temp = messageData;
    messageData = null;
    return temp;
}

function sendSocketNotificationData() {
    let temp = notificationData;
    notificationData = null;
    return temp;
}

export {socket, sendSocketData, sendSocketNotificationData};
