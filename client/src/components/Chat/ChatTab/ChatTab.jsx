import React from 'react'

import { ListItem, ListItemText } from '@material-ui/core';
import {PersonAdd as PersonAddIcon} from '@material-ui/icons';

import InviteChatMemberModal from './InviteChatMember.modal';

const ChatTab = (props) => {
    const {allChats, topic, handleSwitchChat} = props;
    return (
        <ListItem onClick={e => handleSwitchChat(e, topic)} key={topic} button>
            <ListItemText primary={allChats[topic].name} />
            <InviteChatMemberModal chat={allChats[topic]} />
        </ListItem>
    )
}


export default ChatTab;