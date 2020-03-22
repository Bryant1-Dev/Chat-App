import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import Switch from '@material-ui/core/Switch';
import "../styles/settings.style.css";

import VideoLabelIcon from '@material-ui/icons/VideoLabel';

import {Brightness3 as MoonIcon} from '@material-ui/icons';
import {Brightness7 as SunIcon} from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    root: {
      width: '80%',
      border: '1px solid black',
      color: '#ffc',
      borderRadius: '5px',
      padding: '1rem',
      margin: '1rem'
    },
    themeDiv: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%',
        border: '1px solid black',
        color: '#ffc',
        borderRadius: '5px',
        padding: '1rem'
    },
    list: {
        display: 'flex',
        flexDirection: 'row'
    }
}));

const Settings = () => {
    const classes = useStyles();
    const [selectedNavIndex, setSelectedNavIndex] = React.useState(1);
    const [selectedThemeIndex, setSelectedThemeIndex] = React.useState(0);

    const [notifications, setNotifications] = React.useState(false);
    
    const handleChange = event => {
        setNotifications(!notifications);
    };

    const handleListItemClick = (event, index) => {
        setSelectedNavIndex(index);
    };
    const handleThemeIconClick = (event, index) => {
        setSelectedThemeIndex(index);
    };

    return (
        <div className="settings-outer-container">
            <div className="settings-container">
                <div className="settings-navbar">
                    <List component="nav" aria-label="settings navigation">
                        <ListItem
                        button
                        selected={selectedNavIndex === 0}
                        onClick={event => handleListItemClick(event, 0)}
                        >
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Change Display Theme" />
                        </ListItem>
                        <ListItem
                        button
                        selected={selectedNavIndex === 1}
                        onClick={event => handleListItemClick(event, 1)}
                        >
                        <ListItemIcon>
                            <DraftsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Notifications" />
                        </ListItem>
                    </List>
                </div>
                <div className="settings-items-container">
                    <div className={classes.root}>
                        <div className="settings-items-heading">
                            <h1>Themes</h1>
                        </div>
                        <div className="settings-items-content">
                        <List className={classes.list} aria-label="settings navigation">
                            <ListItem
                                selected={selectedThemeIndex === 0}
                                onClick={event => handleThemeIconClick(event, 0)}>
                            
                            <IconButton>
                                <VideoLabelIcon />
                            </IconButton>
                            </ListItem>
                            <ListItem
                                selected={selectedThemeIndex === 1}
                                onClick={event => handleThemeIconClick(event, 1)}
                            >
                            <IconButton>
                                <SunIcon />
                            </IconButton>
                            </ListItem>
                            <ListItem
                                selected={selectedThemeIndex === 2}
                                onClick={event => handleThemeIconClick(event, 2)}
                            >
                            <IconButton>
                                <MoonIcon />
                            </IconButton>
                            </ListItem>
                            </List>
                        </div>
                    </div>
                    <div className={classes.themeDiv}>
                        <div>
                            <h1>Notifications</h1>
                            <p>Turn off your notifications for all chat rooms</p>
                        </div>
                        <div>
                            <Switch
                                checked={notifications}
                                onChange={handleChange}
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings;