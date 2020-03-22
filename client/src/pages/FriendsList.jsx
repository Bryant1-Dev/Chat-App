import React, {useState} from 'react';
import SwipeableViews from 'react-swipeable-views';

import "../styles/friendsList.style.css";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {AppBar, Tabs, Tab, Typography, Box} from '@material-ui/core';
import Friends from '../components/FriendsList/Friends';
import Requests from '../components/FriendsList/Requests';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && <Box p={3}>{children}</Box>}
      </Typography>
    );
}

//View Friends
const data = [
    {profileImage: "https://material-ui.com/static/images/avatar/2.jpg", username: 'Brahmin-Larry', onlineStatus: false},    
    {profileImage: "https://material-ui.com/static/images/avatar/1.jpg", username: 'Helix our Overlord', onlineStatus: true}
]

//Receving friendRequests
const data2 = [
    {
        sender:  {
            profileImage: "https://material-ui.com/static/images/avatar/2.jpg",  
            username: 'Brahmin-Larry'
        },
        receiving: true
    },
    {
        sender:  {
            profileImage: "https://material-ui.com/static/images/avatar/1.jpg", 
            onlineStatus: false, 
            username: 'Helix our Overlord'
        },
        receiving: true
    }
]

//Sending friend Requests
const data3 = [
    {
        recipient:  {
            profileImage: "https://material-ui.com/static/images/avatar/2.jpg", 
            onlineStatus: true, 
            username: 'Brahmin-Larry'
        },
        receiving: false
    },
    {
        recipient:  {
            profileImage: "https://material-ui.com/static/images/avatar/1.jpg", 
            onlineStatus: false, 
            username: 'Helix our Overlord'
        },
        receiving: false
    }
]

const data4 = [...data2, ...data3]

const FriendsList = (props) => {
    const theme = useTheme();
    const [currIndex, setCurrIndex] = useState(0);

    const handleChange = (event, newValue) => {
        setCurrIndex(newValue);
    }
    const handleChangeIndex = (newValue) => {
        setCurrIndex(newValue);
    }
    return (
        <div className="friends-outer-container">
            <div className="friends-info-bar">
                <AppBar position="static" color="default">
                    <Tabs
                        value={currIndex}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        onChange={handleChange}
                        >
                            <Tab label="View Friends" />
                            <Tab label="Pending Friend Requests" />
                    </Tabs>
                </AppBar>
            </div>
            <div className="friends-container">
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={currIndex}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={currIndex} index={0} dir={theme.direction}>
                    <div>
                        <Friends friends={data} />
                    </div>
                </TabPanel>
                <TabPanel value={currIndex} index={1} dir={theme.direction}>
                <div className="requests-container">
                    <Requests requests={data2} receiving={true}/>
                    <Requests requests={data3} receiving={false}/>
                </div>
                </TabPanel>
            </SwipeableViews>
            </div>
        </div>
    )
}

export default FriendsList;