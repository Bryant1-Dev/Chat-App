import React from 'react'
import SettingsIcon from '@material-ui/icons/Settings';
import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import {green} from '@material-ui/core/colors';
import { Paper, Typography, List, 
    ListItem, ListItemText, Chip, Button, TextField } from '@material-ui/core';

import AddChatModal from './AddChatModal';

const useStyles = makeStyles(theme => ({
    root: {
      
        //margin: theme.spacing(2),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '96%',
        //border: '2px solid black',
        padding: '1rem'
        
    },
  }));
  
  

const ChatOptions = (props) => {
    const {topicName} = props;
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <div>
                <AddChatModal />
            </div>
            <div>
            <Typography variant="h4" component="h4">
                Chat Application    
            </Typography>  
            <Typography variant="h5" component="h5">
                {topicName}
            </Typography>
            </div>
            <div>
                <SettingsIcon />
            </div>
        </div>
    )
}

export default ChatOptions;
