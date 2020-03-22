import React, {useState} from 'react';
import SwipeableViews from 'react-swipeable-views';

import "../../styles/entry.style.css";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {AppBar, Tabs, Tab, Typography, Box} from '@material-ui/core';
import Login from './login.component'
import Register from './register.component'

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
const TabBar = (props) => {
    const theme = useTheme();
    const [currIndex, setCurrIndex] = useState(0);

    const handleChange = (event, newValue) => {
        setCurrIndex(newValue);
    }
    const handleChangeIndex = (newValue) => {
        setCurrIndex(newValue);
    }
    return (
        <div>
            <AppBar position="static" color="default">
                <Tabs
                    value={currIndex}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    onChange={handleChange}
                    >
                        <Tab label="Register" />
                        <Tab label="Login" />
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={currIndex}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={currIndex} index={0} dir={theme.direction}>
                    <div className="entry-stacked">
                        <Register />
                    </div>
                </TabPanel>
                <TabPanel value={currIndex} index={1} dir={theme.direction}>
                <div className="entry-stacked">
                    <Login view="stacked"/>
                </div>
                </TabPanel>
            </SwipeableViews>
        </div>
    )
}

export default TabBar;