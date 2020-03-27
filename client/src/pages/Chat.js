import React, {useState, useContext, useEffect} from 'react'
import { makeStyles, Paper, Typography, List, 
    ListItem, ListItemText, Chip, Button, TextField } from '@material-ui/core';

import ChatOptions from '../components/Chat/ChatOptions';
import ChatTab from '../components/Chat/ChatTab/ChatTab';

import {sendSocketData} from '../utils/socket';
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
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);
    //const [latestMessageTime, setlatestMessageTime] = useState(null);
    let latestMessageTime = null;
    useEffect(() => {
        //console.log('running')
        console.log('activeTopic on update: ' + activeTopic);
         console.log(JSON.stringify(allChats));
        const socketData = sendSocketData();
        //console.log(socketData);
        if (socketData) {
            console.log('reached hook: ' + JSON.stringify(socketData))
            if(socketData && socketData.currentTime != latestMessageTime) {
                console.log('dispatching socket data...')
                latestMessageTime = socketData.currentTime;
                chatDispatch({type: 'RECIEVE_MESSAGE', payload : socketData})
            }
        }
        
    })

    useEffect(() => {
        if(textValue.length > 0 && sending) {
            console.log('sending hook executes')
            sendChatAction({userId: user.id, message: textValue, chatId: activeTopic}, socket)
            setSending(false);
        }
    }, [sending])

    const handleSwitchChat = (event, chatId) => {
        event.preventDefault();
        switchChatRoom({chatId: chatId, userId: user.id}, socket)
        setActiveTopic(chatId);
        setMessages(allChats[chatId].messages);
    }

    //On component load get all chats this user is in
    useEffect(() => {
        if(user !== null) {
            axios.post(`/chats`, {userId: user.id}).then(response => {
                //console.log("post", JSON.stringify(response.data))
                if(response.data.success) {
                    //dispatch the payload to the chat store
                    const {chats} = response.data.payload; 
                    //console.log("Hello: " + JSON.stringify(Object.keys(chats).length === 0));

                    chatDispatch({type: 'LOAD_CHATS', payload: chats});
                    console.log("Hello: " + JSON.stringify(chats));

                    //chats not empty {}, else keep defaults
                    if(Object.keys(chats).length !== 0) {
                        console.log('inital chats: ' + chats[Object.keys(chats)[0]].messages.length)
                        setActiveTopic(Object.keys(chats)[0]);
                        setMessages(chats[Object.keys(chats)[0]].messages)    
                    }
                    
                    
                }
                setLoading(false);
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
        
        {
            loading && (
                (
                    <div>
                        Loading...
                    </div>
                )
            )
        }

        {
            !loading && (
                <>
                    {
                        (allChats && Object.keys(allChats).length !== 0) ? (
                            <div className={classes.container}>
                                <Paper className={classes.root}>
                                    <ChatOptions topicName={allChats[activeTopic].name} />
                                    <div className={classes.flex}>
                                        <div className={classes.topicsWindow}>
                                            <List>
                                                {
                                                    topics.map(topic => {
                                                        return (
                                                            <ChatTab allChats={allChats} topic={topic} handleSwitchChat={handleSwitchChat} /> 
                                                        )
                                                    })
                                                }
                                            </List>
                                        </div>
                                        <div className={classes.chatWindow}>
                                        {
                                                    allChats[activeTopic].messages.map((messageContent, index) => {
                                                        return (
                                                            <div className={classes.flex} key={index}> 
                                                                <Chip label={messageContent.from} className={classes.chip} />
                                                                <Typography component="p">
                                                                    {messageContent.message}
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
                                                    setSending(true)
                                                }}
                                                className={classes.button}
                                                variant="contained" 
                                                color="primary"
                                            >
                                            Send
                                        </Button>
                                    </div>           
                                        
                                </Paper>  
                        </div>
                        )
                        :
                        (
                            <div className={classes.container}>
                                <Paper className={classes.root}>
                                    <ChatOptions topicName={'You are not a part of any chat rooms'} />
                                        <div className={classes.flex}>
                                            <div className={classes.topicsWindow}>
                                            </div>
                                            <div className={classes.chatWindow}>
                                            </div>
                                        </div>
                                        <div className={classes.flex}>
                                        </div>  
                                </Paper>  
                        </div>
                        )
                    }
                </>
            )
        }
        
        {/*(allChats && activeTopic) ? (
            <div className={classes.container}>
                <Paper className={classes.root}>
                    <ChatOptions topicName={allChats[activeTopic].name} />
                    <div className={classes.flex}>
                        <div className={classes.topicsWindow}>
                            <List>
                                {
                                    topics.map(topic => {
                                        return (
                                            <ChatTab allChats={allChats} topic={topic} handleSwitchChat={handleSwitchChat} /> 
                                        )
                                    })
                                }
                            </List>
                        </div>
                        <div className={classes.chatWindow}>
                        {
                                    allChats[activeTopic].messages.map((messageContent, index) => {
                                        return (
                                            <div className={classes.flex} key={index}> 
                                                <Chip label={messageContent.from} className={classes.chip} />
                                                <Typography component="p">
                                                    {messageContent.message}
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
                                setSending(true)
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
            )*/}
        </>
    )
}

export default Chat;
