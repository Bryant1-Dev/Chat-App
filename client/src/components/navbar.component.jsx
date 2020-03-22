import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {Link} from 'react-router-dom';

import {AppBar, Tab, Tabs, Typography, Box, Button, 
  Menu, MenuItem, ListItemIcon, ListItemText} from '@material-ui/core';

/* import InboxIcon from '@material-ui/icons/MoveToInbox'; */
import DraftsIcon from '@material-ui/icons/Drafts';
/* import SendIcon from '@material-ui/icons/Send';
 */
import ChatIcon from '@material-ui/icons/Chat';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import NotificationsIcon from '@material-ui/icons/Notifications';
/* import NotificationImportantIcon from '@material-ui/icons/NotificationImportant'; */
import SettingsIcon from '@material-ui/icons/Settings';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

  function a11yProps(index) {
    return {
      id: `scrollable-prevent-tab-${index}`,
      'aria-controls': `scrollable-prevent-tabpanel-${index}`,
    };
  }
  
  const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      width: '100vw',
      backgroundColor: theme.palette.background.paper,
      height: '8vh'
    },
    tabLink: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    menuItem: {
      '&:focus': {
        backgroundColor: theme.palette.primary.main,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: theme.palette.common.white,
        },
      },
    }
  }));

const NavBar = () => {

    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return(
        <div className={classes.root}>
            <AppBar position="static">
                <Tabs
                variant="fullWidth"
                value={value}
                onChange={handleChange}
                aria-label="nav tabs example"
                >
                  
                  <Tab className={classes.tabLink} component={Link} to={"/chat"} icon={<ChatIcon />} label="Chat" aria-label="chat" {...a11yProps(0)} />
                  <Tab className={classes.tabLink} component={Link} to={"/notifications"} icon={<NotificationsIcon />} label="notifications" aria-label="notifications" {...a11yProps(1)} />
                  <Tab className={classes.tabLink} component={Link} to={"/friends-list"} icon={<PeopleAltIcon />} label="friends list" aria-label="friends list" {...a11yProps(2)} />
                  <Tab className={classes.tabLink} onClick={handleClick} icon={<SettingsIcon />} label="settings" aria-label="settings" {...a11yProps(3)} />
                  <StyledMenu
                    id="customized-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem
                      className={classes.menuItem}
                      component={Link}
                      to={'/user-profile'}
                    >
                        <ListItemIcon>
                        <AccountCircleIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="See profile" />
                    </MenuItem>
                    <MenuItem
                      className={classes.menuItem}
                      component={Link}
                      to={'/user-settings'}
                    >
                        <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Settings" />
                    </MenuItem>
                    <MenuItem
                      className={classes.menuItem}
                      component={Link}
                      to={'/sign-out'}
                    >
                        <ListItemIcon>
                        <DraftsIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Sign Out" />
                    </MenuItem>
                  </StyledMenu>
                </Tabs>
            </AppBar>
        </div>
    )
}

export default NavBar;