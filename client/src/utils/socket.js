import io from 'socket.io-client'

let socket = io(':8080');

let socketData;

socket.on('message', (data) => {
    socketData = data;
    socketData.currentTime = Date.now();
    console.log('socket on message: ' + JSON.stringify(socketData));   
})

function sendSocketData() {
    let temp = socketData;
    socketData = null;
    return temp;
}

export {socket, sendSocketData};
