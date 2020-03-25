import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import {List, Typography} from '@material-ui/core';

import Notification from '../components/Notifications/Notification';
import {UserContext} from '../stores/UserStore';
import {NotificationContext} from '../stores/NotificationStore';

import {addChatInviteNotificationMessages} from '../utils/util';
import {socket, sendSocketNotificationData} from '../utils/socket';

import '../styles/notifications.style.css';

const data = [
    {
        chatRoom: 'Vaste Lordes',
        message: 'a new user has joined the chat',
        profileImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTOc7TEw_FSvWMYwioGSA2axxpO1RLOEu30gsR417WhVjRnS-kF'
    },
    {
        chatRoom: 'Seven Deadly Sins',
        message: 'you have been kicked from this chat',
        profileImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS6VfmmhTs7Lkt55q2vAu_g3TFNs5-uL8qjQR4_etc_okF32XJA'
    }

]
const imageUrls = ['https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTOc7TEw_FSvWMYwioGSA2axxpO1RLOEu30gsR417WhVjRnS-kF', 
'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS6VfmmhTs7Lkt55q2vAu_g3TFNs5-uL8qjQR4_etc_okF32XJA'];
//const data2 = [...data, ...data, ...data, ...data, ...data]

const useStyle = makeStyles(theme => ({
    root: {
        overflowY: "auto",
        margin: 0,
        padding: 0,
        listStyle: "none",
        height: "100%",
        '&::-webkit-scrollbar': {
          width: '0.4em'
        },
        '&::-webkit-scrollbar-track': {
          boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
          webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,.1)',
          outline: '1px solid slategrey'
        }
      }
}))

const Notifications = () => {
    const classes = useStyle();

    const {user} = useContext(UserContext);
    const {allNotifications, notificationDispatch} = useContext(NotificationContext);
    const notificationIds = allNotifications ? Object.keys(allNotifications) : [];


    const [loading, setLoading] = useState(true);

    let latestMessageTime = null;

    //On initial load
    //On component load get all notifications this user has
    useEffect(() => {
        if(user !== null) {
            axios.post(`/notifications`, {userId: user.id}).then(response => {
                if(response.data.success) {
                    
                    //Assign all the notifications messages
                    const {notifications} = response.data.payload;
                    if(notifications) {
                        const keys = Object.keys(notifications);
                        keys.forEach(key => {
                            notifications[key] = addChatInviteNotificationMessages(notifications[key]);
                        });
                    }

                    //dispatch the payload to the notification store
                    notificationDispatch({type: 'LOAD_NOTIFICATIONS', payload: notifications});
                    console.log("On Notifications page load: " + JSON.stringify(notifications));
                    
                }
                setLoading(false);
            })
        }
        
    }, [user]);

    //Every render check if we have any new notification data from our socket
    useEffect(() => {
    
        const socketData = sendSocketNotificationData();
        
        if (socketData) {
            console.log('reached notification hook: ' + JSON.stringify(socketData))
            if(socketData && socketData.currentTime != latestMessageTime) {
                console.log('dispatching socket notification data...')
                latestMessageTime = socketData.currentTime;
                notificationDispatch({type: 'RECEIVE_NOTIFICATION', payload : socketData})
            }
        }
        
    })

    return (
        <>
            {loading && (<div>Loading</div>)}
        
            {!loading && 
                (<>
                    
                        <div className="notifications-outer-container">
                            <div className="notifications-container">
                                {(notificationIds > 0) ? (
                                    <List className={classes.root}>
                                    {
                                        notificationIds.map((id, index) => {
                                            //Until we properly implement BLOB data or set up a file API, we will use random images
                                            return (<Notification imageSource={imageUrls[index % imageUrls.length]} notification={allNotifications[id]} />)
                                        })
                                    }
                                </List>
                                )
                            :
                            (
                                <Typography variant="h5" component="h5">
                                    You have no new notifications
                                </Typography>
                            )}
                                
                            </div>
                        </div>
                    
                </>)
            }
        </>
    )
}

export default Notifications;
