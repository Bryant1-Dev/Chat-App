import React from 'react'

import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

const Notification = (props) => {
    const {notification} = props;
    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar alt={`${notification.chatRoom} chat room notification`} src={notification.profileImage} />
            </ListItemAvatar>
            <ListItemText primary={notification.chatRoom} secondary={notification.message} />
            <ListItemSecondaryAction>
                <Button variant="outlined" color="primary" edge="end" aria-label="comments">
                    Dismiss
                </Button>
            </ListItemSecondaryAction>
        </ListItem>
    )
}

export default Notification;
