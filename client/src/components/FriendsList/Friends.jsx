import React from 'react'
import Friend from './Friend';
const Friends = (props) => {
    
    const display = props.friends.map((friend, index) => {
        return (<Friend key={index} user={friend} />)
    })
    return (
        <div>
            {display}
        </div>
    )
}

export default Friends;