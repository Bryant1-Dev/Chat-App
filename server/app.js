const http = require('http');
const express = require('express')
const socketio = require('socket.io')
const {db, poolConfig} = require('./config/database');

const pg = require('pg');
const session = require("express-session");
const pgSession = require('connect-pg-simple')(session);
const passport = require("passport");

const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


const users = require('./routes/users');

const PORT = process.env.PORT || 8080;
const PRODCUCTION = process.env.PRODCUCTION || 'development';
const SECRET = process.env.SECRET || 'secret';

const {addUser, removeUser, getUser, getUsersInRoom} = require('./controllers/chat.controller');

require("./config/passport")(passport);

app.set("trust proxy", true);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 

app.use(
  session({
    name: "sid",
    resave: false,
    saveUninitialized: false,
    secret: SECRET,
    store: new pgSession({
        pool: new pg.Pool(poolConfig),
        tableName: 'session'
    }),
    cookie: {
      httpOnly: true,
      secure: PRODCUCTION === "production",
      maxAge: 1000 * 60 * 60 * 24 // 1 days
    }
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Socket logic
io.on('connection', (socket) => {
    console.log("We have a new connection!!!")

    socket.on('chat message', (data) => {
        console.log(JSON.stringify(data))
        io.emit('chat message', data)
    })

    socket.on('join', (data, callback) => {
        //console.log(data.name, data.room);
        const {error, user} = addUser({ id: socket.id, name: data.name, room: data.room} )
        
        if(error) return callback(error);

        console.log(user.name, user.room);

        socket.emit('message', {user: 'admin', text: `${user.name} welcome to the room ${user.room}!`})
        socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.name} has joined!`})

        socket.join(user.room)

        io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})

        callback(); //No errors
    })
    
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        if(!user) {
            return callback({user: 'admin', text: 'No user found'})
        }

        console.log('Retreived user: ' + JSON.stringify(user))
        console.log(`sendMessage event: ${message}`)
        io.to(user.room).emit('message', { user: user.name, text: message})
        //May need to add emit for roomData here?
        callback();
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('message', {user: 'admin', text: `${user.name} has left`})
            io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})
        }
        console.log("A user has left (disconnected)")
    })
})


app.use('', require('./routes/index'));
app.use('/users', users);

server.listen(PORT, () => console.log(`Server listening on port ${PORT}...`))