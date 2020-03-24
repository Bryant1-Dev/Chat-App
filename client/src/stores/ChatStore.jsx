import React, {createContext, useReducer, useContext, useEffect, useState} from 'react'
import {socket, sendSocketData} from '../utils/socket';

import {UserContext} from '../stores/UserStore';
export const ChatContext = createContext();
 

/*
    msg: {
        from: 'user',
        msg: 'hello',
        topic: 'general'
    }

    state: {
        topic1: [
            {msg}, {msg}, {msg} 
        ],
        topic2: [
            {msg}, {msg}, {msg} 
        ],
    }

*/

const initState = {
    general: [
        {from: 'Aurius', msg:'hello'},
        {from: 'Harumi', msg:'hi'},
        {from: 'Haruomi', msg:'How are you guys?'}
    ],
    other: [
        {from: 'Mirio', msg:'The best'},
        {from: 'Aurius', msg:`みりおだよ`},
        {from: 'Wang Lu', msg:'你们会说韩语吗？'}
    ]
}
function reducer(state, action) {
    const {user, text} = action.payload;
    switch(action.type) {
        case 'LOAD_CHATS': 
        console.log('load_chats')
            return action.payload;
        case 'RECIEVE_MESSAGE': 
        console.log('recieve_message')
            const newMessages = [...state[user.chatId].messages, {from: user.username, message: text}];
            const clonedState = {...state} 
            clonedState[user.chatId].messages = newMessages;
            console.log("applied state changes: " + JSON.stringify(state))
            return clonedState;
        
        default: 
        console.log('default')
            return state;
    }
}



//chatDispatch({type: 'RECIEVE_MESSAGE', payload : data})
    //setMessages([...messages, data])

export default function ChatStore(props) {
    const [allChats, dispatch] = useReducer(reducer, null);

    

    const {user, userDispatch} = useContext(UserContext);
    
    return (
        <ChatContext.Provider value={{allChats, user, chatDispatch: dispatch, socket}}>
            {props.children}
        </ChatContext.Provider>
    )
}
