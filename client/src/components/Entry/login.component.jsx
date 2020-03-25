import React, {useState, useContext} from 'react';
import { withRouter } from "react-router-dom";
import axios from 'axios';

import {UserContext} from '../../stores/UserStore';
import {makeStyles, TextField, Button} from '@material-ui/core';

import '../../styles/entry.style.css';

import {socket} from '../../utils/socket';

const Login = (props) => {
    
    const {view} = props;
    const toggleDisplay = view === 'stacked' ? {"border": "none"} : {"display": "flex"};
    //Context store
    const {user, userDispatch} = useContext(UserContext);

    //Local State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleLogin = (event) => {
        event.preventDefault();

        const data = {email, password}

        axios.post('/users/login', data).then(response => {
            if(response.data.success) {
                console.log(JSON.stringify(response.data.payload))
                socket.emit('notifyLogin', response.data.payload.user, (err, user) => {
                    
                    //This error will only come from the database malfunctioning during a query
                    if(err) {
                        console.log(`Error from socket login: ${err}`);
                        userDispatch({type: 'login', payload: response.data.payload.user}); //user w/o socket id
                        props.history.push('/chat'); //redirect to the chat dashboard
                        return;
                    } 
                    
                    userDispatch({type: 'login', payload: user}); //user with socketid
                    props.history.push('/chat'); //redirect to the chat dashboard
                });
                
                setEmail('');
                setPassword('');
            }
             else {
                 console.error(response.error);
                 setPassword('');
             }
        })
    }
    //redirect if user (from store) exists
    return (

        <div className="entry-sub-container entry-login" style={toggleDisplay}>
            <h1>Login</h1>
            <form className="entry-form" onSubmit={handleLogin}>
                <TextField label="Email" type="email" onChange={e => setEmail(e.target.value)} />
                <TextField label="Password" type="password" onChange={e => setPassword(e.target.value)} />
                <Button type="submit" variant="outlined" color="primary">
                    Login
                </Button>
            </form>
        </div>
    )
}

export default withRouter(Login);