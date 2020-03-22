
import React, { useState, useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import axios from 'axios';

import {UserContext} from '../stores/UserStore';

const AuthenticatedComponent = (props) =>  {

    const {user, userDispatch} = useContext(UserContext);

    const [verified, setVerified] = useState(false);
  
    useEffect(() => {
        axios.post('/users/verify').then(response => {
            setVerified(response.data.success);
            userDispatch({type: 'verify', payload: response.data.payload.user});
            
            if (!response.data.success) {
                console.log("Session ended: " + JSON.stringify(response.data));
                props.history.push("/");
            }
        })
    }, [])

  
  return (
      <>
        {verified ? 
            (
                <div>
                    {props.children}
                </div>
            )
             : 
             (
                <div>
                    <p>Loading...</p>
                </div>
                
             )
        }
      </>
  );
  
}

export default withRouter(AuthenticatedComponent);
