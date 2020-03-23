import React, {useState, useContext, useEffect} from 'react'
import { makeStyles, Paper, Typography, List, 
    ListItem, ListItemText, Chip, Button, TextField } from '@material-ui/core';

import {ChatContext} from '../stores/ChatStore';
import {UserContext} from '../stores/UserStore';

import axios from 'axios';

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
    const {user} = useContext(UserContext);
    const {allChats, chatDispatch, socket} = useContext(ChatContext);
    const topics = allChats ? Object.keys(allChats) : [];

    //local state
    const [textValue, setTextValue] = useState("");
    const [activeTopic, setActiveTopic] = useState("")
    const [messages, setMessages] = useState([])

    useEffect(() => {
        
            socket.on('message', (data) => {
                console.log("runs")
                console.log('socket on message: ' + JSON.stringify(data));
                chatDispatch({type: 'RECIEVE_MESSAGE', payload : data})
                setMessages([...messages, data])
                //setMessages([...messages, message])
            })
        
        
    }, [messages])

    

    //On component load get all chats this user is in
    useEffect(() => {
        if(user !== null) {
            axios.post(`/chats`, {userId: user.id}).then(response => {
                //console.log("post", JSON.stringify(response.data))
                if(response.data.success) {
                    //dispatch the payload to the chat store
                    const {chats} = response.data.payload; 
                    chatDispatch({type: 'LOAD_CHATS', payload: chats});
                    console.log("Hello: " + JSON.stringify(chats));
                    setActiveTopic(Object.keys(chats)[0]);
                    console.log('inital chats: ' + chats[Object.keys(chats)[0]].messages.length)
                    setMessages(chats[Object.keys(chats)[0]].messages)
                }
            })
        }
        
    }, [user])


    //When user clicks a chatroom join that room
    useEffect(() => {
        console.log('user: ' + JSON.stringify(user))
        console.log('\nactiveTopic: ' + activeTopic)
        if(user !== null && activeTopic !== '') {
            switchChatRoom({chatId: activeTopic, userId: user.id }, socket) 
        }
    }, [user, activeTopic])

    function sendChatAction(data, socket) {
        if(data && textValue) {
            socket.emit('sendMessage', data, () => {console.log('Sent message!'); setTextValue('');});
            
        }
        
    }

    function joinChatRoom(data, socket) {
        socket.emit('join', data);
    }

    function switchChatRoom(data, socket) {
        console.log(typeof data.chatID)
        if(typeof data.chatId !== 'number') {
            if(!isNaN(parseInt(data.chatId))) {
                data.chatId = parseInt(data.chatId);
                socket.emit('switchRoom', data, () => {
                    console.log(`Joined ${data.chatId}`)
                });
            }
        }
        
    }

    return (
        <>
        {(allChats && activeTopic) ? (
            <div className={classes.container}>
                <Paper className={classes.root}>
                    <Typography variant="h4" component="h4">
                        Chat Application    
                    </Typography>  
                    <Typography variant="h5" component="h5">
                        {allChats[activeTopic].name}
                    </Typography>
                    <div className={classes.flex}>
                        <div className={classes.topicsWindow}>
                            <List>
                                {
                                    topics.map(topic => {
                                        return (
                                            <ListItem onClick={e => setActiveTopic(e.target.innerText)} key={topic} button>
                                                <ListItemText primary={allChats[topic].name} />
                                            </ListItem>
                                        )
                                    })
                                }
                            </List>
                        </div>
                        <div className={classes.chatWindow}>
                        {
                                    messages.map((messageContent, index) => {
                                        return (
                                            <div className={classes.flex} key={index}> 
                                                <Chip label={messageContent.user.username} className={classes.chip} />
                                                <Typography component="p">
                                                    {messageContent.text}
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
                            value={textValue}
                    />
                    <Button 
                            onClick={() => {
                                sendChatAction({userId: user.id, message: textValue, chatId: activeTopic}, socket)
                            }}
                            className={classes.button}
                            variant="contained" 
                            color="primary"
                        >
                        Send
                        </Button>
                    </div>           
                        
                </Paper>  
            </div>)
            :
            (
                <div>
                    Loading...
                </div>
            )}
        </>
    )
}

export default Chat;
