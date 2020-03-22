import React, {createContext, useReducer} from 'react'
import io from 'socket.io-client'


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
    const {from, msg, topic} = action.payload;
    switch(action.type) {
        case 'RECIEVE_MESSAGE': 
            return {
                ...state,
                [topic]: [
                    ...state[topic],
                    {
                        from,
                        msg
                    }
                ]
            }
        default: 
            return state;
    }
}

let socket;

function sendChatAction(value) {
    socket.emit('chat message', value);
}


export default function ChatStore(props) {
    const [allChats, dispatch] = useReducer(reducer, initState)

    if(!socket) {
        socket = io(':8080')
        socket.on('chat message', data => {
            dispatch({type: 'RECIEVE_MESSAGE', payload : data})
        })
    }

    const user = 'Aurius' + Math.random(100).toFixed(2);
    
    return (
        <ChatContext.Provider value={{allChats, sendChatAction, user}}>
            {props.children}
        </ChatContext.Provider>
    )
}
