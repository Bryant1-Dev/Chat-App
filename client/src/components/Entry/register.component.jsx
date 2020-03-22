import React, {useState} from 'react';
import axios from 'axios'

import {makeStyles, TextField, Button} from '@material-ui/core';

import '../../styles/entry.style.css';

export const Register = (props) => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const handleRegister = (event) => {
        event.preventDefault();
        console.log('submitting')
        const data = {username, email, password, confirmPassword}

        axios.post('/users/register', data).then(response => {
            
            if(response.data.success) {
                setUsername('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                //Show sucessfully registered, allow to register again
                //switch over to Login component if on split display
            }
             else {
                 console.log(JSON.stringify(response.data))
                console.log('we failed')
             }
        })
    }

    return (

        <div className="entry-sub-container">
            <h1>Register</h1>
            <form className="entry-form" onSubmit={handleRegister}>
                <TextField label="Username" type="text" onChange={e => setUsername(e.target.value)} />
                <TextField label="Email" type="email" onChange={e => setEmail(e.target.value)} />
                <TextField label="Password" type="password" onChange={e => setPassword(e.target.value)} />
                <TextField label="Confirm Password" type="password" onChange={e => setConfirmPassword(e.target.value)} />
                <Button type="submit" variant="outlined" color="primary">
                    Register
                </Button>
            </form>
        </div>
    )
}

export default Register;