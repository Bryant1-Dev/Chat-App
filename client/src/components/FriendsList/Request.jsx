import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import { green } from '@material-ui/core/colors';
import '../../styles/friendsList.style.css';

const Request = (props) => {
    
    const {receiving} = props.request;
    
    return (
        <ListItem>
            <div className="request-entry">
            
            {receiving ? 
                (
                    <>
                        <ListItemAvatar>
                            <Avatar alt={props.request.sender.username} src={props.request.sender.profileImage} />
                        </ListItemAvatar>
                        <ListItemText primary={props.request.sender.username} secondary="Pending Friend Request" />
                        <Button variant="outlined" color="primary" edge="end" aria-label="comments">
                            Accept
                        </Button>
                        <Button variant="outlined" color="secondary" edge="end" aria-label="comments">
                            Decline
                        </Button>
                    </>
                ) 
                    : 
                (
                    <>
                        <ListItemAvatar>
                            <Avatar alt={props.request.recipient.username} src={props.request.recipient.profileImage} />
                        </ListItemAvatar>
                        <ListItemText primary={props.request.recipient.username} secondary="Pending Friend Request" />
                        <ListItemSecondaryAction>
                        <Button variant="outlined" color="secondary" edge="end" aria-label="comments">
                            Cancel
                        </Button>
                        </ListItemSecondaryAction>
                    </>
                )}
            </div>
        </ListItem>
    );
}

export default Request;