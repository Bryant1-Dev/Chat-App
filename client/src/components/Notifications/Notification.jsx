import React from 'react'

import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

const Notification = (props) => {
    const {notification, imageSource} = props;
    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar alt={`${notification.chat.name} chat room notification`} src={imageSource} />
            </ListItemAvatar>
            <ListItemText primary={notification.chat.name} secondary={notification.data.message} />
            <ListItemSecondaryAction>
                <Button variant="outlined" color="primary" edge="end" aria-label="comments">
                    Dismiss
                </Button>
            </ListItemSecondaryAction>
        </ListItem>
    )
}

export default Notification;
