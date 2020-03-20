const http = require('http');
const express = require('express')
const socketio = require('socket.io')

const app = express();
const server = http.createServer(app);
const io = socketio(http);

const PORT = process.env.PORT || 8080;

io.on('connection', (socket) => {

})

server.listen(PORT, () => console.log(`Server listening on port ${PORT}...`))