import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

import Request from './Request';

const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
      overflow: 'auto',
      maxHeight: '400px',
    },
  }));

const Requests = (props) => {
    const classes = useStyles();
    const display = props.requests.map((request, index) => {
        return (<Request key={index} request={request} />)
    })
    return (
        <>
            {
                props.receiving ? 
                    (<h2>Pending Requests</h2>)
                    :
                    (<h2>Your Friend Requests</h2>)
            }
            <List className={classes.root}>
                {display}
            </List>
        </>
    )
}

export default Requests;