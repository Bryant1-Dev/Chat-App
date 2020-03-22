import React, {useState, useContext} from 'react';
import axios from 'axios';

import {UserContext} from '../../stores/UserStore';
import {makeStyles, TextField, Button} from '@material-ui/core';

import '../../styles/entry.style.css';

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

        axios.post('/login', data).then(response => {
            if(response.data.success) {
                userDispatch({type: 'login', payload: response.data.result});
                //redirect to the dashboard
            }
             else {
                 console.error(response.error);
             }
        })
    }
    //redirect if user (from store) exists
    return (

        <div className="entry-sub-container entry-login" style={toggleDisplay}>
            <h1>Login</h1>
            <form className="entry-form" onSubmit={handleLogin}>
                <TextField label="Email" onChange={e => setEmail(e.target.value)} />
                <TextField label="Password" onChange={e => setPassword(e.target.value)} />
                <Button variant="outlined" color="primary">
                    Login
                </Button>
            </form>
        </div>
    )
}

export default Login;