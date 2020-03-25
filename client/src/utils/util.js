
function addChatInviteNotificationMessages (payload) {
    //Is the user the sender of this chat invitation?
    if(payload.data.isSender) {
        switch(payload.data.status.trim().toLowerCase()) {
            case 'pending': 
                payload.data.message = `Your invitation to ${payload.recipient.name} for the room ${payload.chat.name} is pending...`;
            break;
            case 'denied':
                payload.data.message = `${payload.recipient.name} has denied your chat invitation to ${payload.chat.name}.`;
                break;
            case 'accepted':
                payload.data.message = `'${payload.recipient.name} has accepted your chat invitation to ${payload.chat.name}!`;
                break;
            default:
                payload.data.message = 'Make sure Enum is properly implemented in database or add more states';
                break;
        }
    }

    //Then the user must be the recipient

    else {
        payload.data.message = `${payload.sender.name} invited you to ${payload.chat.name}!`;
    }

    return payload;
}

export {addChatInviteNotificationMessages};