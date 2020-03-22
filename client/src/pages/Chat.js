import React, {useState, useContext} from 'react'
import { makeStyles, Paper, Typography, List, 
    ListItem, ListItemText, Chip, Button, TextField } from '@material-ui/core';

import {ChatContext} from '../stores/ChatStore';

const useStyles = makeStyles(theme => ({
    root: {
        margin: '50px',
        //padding: theme.spacing(3, 2),
        textAlign: 'center',
        backgroundColor: '#ceb379cc',
        border: '2px solid #79ceb8',
        width: '80%'
    },
    flex: {
        display: 'flex',
        alignItems: 'center'
    },
    topicsWindow: {
        width: '30%',
        height: '300px',
        borderRight: '1px solid grey'
    },
    chatWindow: {
        width: '70%',
        height: '300px',
        padding: '20px'
    },
    chatBox: {
        width: '85%'
    },
    button: {
        width: '15%'
    },
    container: {
        backgroundColor: '#ceb379cc',
        width: '100vw',
        height: '92vh',
        //border: '1px solid blue',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
}))

const Chat = () => {
    const classes = useStyles();

    //CTX Store
    const {allChats, sendChatAction, user} = useContext(ChatContext);
    const topics = Object.keys(allChats);

    //local state
    const [textValue, setTextValue] = useState("");
    const [activeTopic, setActiveTopic] = useState(topics[0] || "You have no topics")

    return (
        <div className={classes.container}>
            <Paper className={classes.root}>
                <Typography variant="h4" component="h4">
                    Chat Application    
                </Typography>  
                <Typography variant="h5" component="h5">
                    {activeTopic}
                </Typography>
                <div className={classes.flex}>
                    <div className={classes.topicsWindow}>
                        <List>
                            {
                                topics.map(topic => {
                                    return (
                                        <ListItem onClick={e => setActiveTopic(e.target.innerText)} key={topic} button>
                                            <ListItemText primary={topic} />
                                        </ListItem>
                                    )
                                })
                            }
                        </List>
                    </div>
                    <div className={classes.chatWindow}>
                    {
                                allChats[activeTopic].map((chatContent, index) => {
                                    return (
                                        <div className={classes.flex} key={index}> 
                                            <Chip label={chatContent.from} className={classes.chip} />
                                            <Typography component="p">
                                                {chatContent.msg}
                                            </Typography>
                                        </div>
                                    )
                                })
                            }
                    </div>
                </div>
                <div className={classes.flex}>
                   <TextField
                        className={classes.chatBox}
                        label={"Send a chat"}
                        onChange={e => setTextValue(e.target.value)}
                   />
                   <Button 
                   onClick={() => {
                       sendChatAction({from: user.username, msg: textValue, topic: activeTopic})
                        setTextValue('')
                    }}
                   className={classes.button}
                   variant="contained" 
                   color="primary">
                       Send
                    </Button>
                </div>           
                    
            </Paper>  
        </div>
    )
}

export default Chat;
