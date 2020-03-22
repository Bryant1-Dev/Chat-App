import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';

import '../../styles/friendsList.style.css';

const Friend = (props) => {
    
    const {user} = props;
    
    return (
        <div className="friend-entry">
            <Avatar alt="Profile picture" src={user.profileImage} />
            <p>{user.username}</p>
            <Button variant="outlined" color="primary">
                Chat With
            </Button>
            { user.onlineStatus ?
                (
                    <>
                        <code className="friend-online">Online</code>
                    </>
                )
                :
                (
                    <>
                        <code className="friend-offline">Offline</code>
                    </>
                )

            }
        </div>
    )
}

export default Friend;

//Chat With(Button Link),  Online Status (String), Profile picture (Avatar)