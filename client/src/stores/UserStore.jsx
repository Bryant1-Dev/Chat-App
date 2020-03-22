import React, {createContext, useReducer} from 'react'

export const UserContext = createContext();

const initialState =  null;

function reducer(state, action){
    switch(action.type) {
        case 'login':
            return action.payload;
        case 'verify':
            return action.payload;
        default: 
            return state;
    }
}

export default function UserStore (props) {
    const [ user, dispatch] = useReducer(reducer, initialState);

    return (
        <UserContext.Provider value={{user, userDispatch: dispatch}}>
            {props.children}
        </UserContext.Provider>
    )
}   