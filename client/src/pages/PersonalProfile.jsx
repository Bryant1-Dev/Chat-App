import React, {useContext} from 'react';

import {UserContext} from '../stores/UserStore';
import {makeStyles} from '@material-ui/core';
import {AccountCircle, Edit as EditIcon} from '@material-ui/icons';

import EditModal from '../components/PersonalProfile/EditModal.jsx';

import picture from '../assets/fantasylibrary.jpg';

import "../styles/personalProfile.style.css";

const randomUrl = `https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSFrwJtAmcNxLwFo4kq2g6tSFXWBFP5_nWKdTD8nW89ntNah2UK`;
const styles = makeStyles({
    profileImage: {
        textAlign: 'center',
        border: '1px solid blue',
        width: `20%`,
        height: `60%`,
        borderRadius: '50%',
        backgroundImage: `url(${randomUrl})`,
        backgroundPosition: 'center', 
        backgroundSize: 'cover', 
        backgroundRepeat: 'no-repeat',
    },
    flexBox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '40%'
    },
    profileWrapper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        width: '100%',
        height: '95%',
        borderRadius: '5px'
    }
})

const PersonalProfile = (props) => {
    const classes = styles();
    const {user, userDispatch} = useContext(UserContext);
    return (
        <div className="profile-outer-container">
            <div className="profile-background">
                <div className="profile-container">
                    <div className="profile-settings">
                        <div><EditModal /></div>
                    </div>
                    <div className={classes.profileWrapper}>
                        <div className={classes.flexBox}>
                            <div className={classes.profileImage}>
                                {/* <div>Image Text</div> */}
                            </div>  
                        </div>
                        <div className="profile-information">
                            {/*user.friends.length}*/}
                            <div><p>{user ? JSON.stringify(user) : 'Username Here'}</p></div>
                            {/*user.friends.length}*/}
                            <div><p>{user ? JSON.stringify(user) : 28}{' | '} Friends</p></div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PersonalProfile;