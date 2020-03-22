import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

import Notification from '../components/Notifications/Notification';

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

const data2 = [...data, ...data, ...data, ...data, ...data]

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
    return (
        <div className="notifications-outer-container">
            <div className="notifications-container">
                <List className={classes.root}>
                    {
                        data2.map((notification, index) => {
                            return (<Notification notification={notification} />)
                        })
                    }
                </List>
            </div>
        </div>
    )
}

export default Notifications;
