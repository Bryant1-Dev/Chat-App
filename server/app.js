const http = require('http');
const express = require('express')
const socketio = require('socket.io')
const {db, poolConfig} = require('./config/database');

const pg = require('pg');
const session = require("express-session");
const pgSession = require('connect-pg-simple')(session);
const passport = require("passport");

const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


const users = require('./routes/users');
const chats = require('./routes/chats');

const PORT = process.env.PORT || 8080;
const PRODCUCTION = process.env.PRODCUCTION || 'development';
const SECRET = process.env.SECRET || 'secret';

const {addUser, removeUser, getUser, getUsersInRoom, retrieveUserChats, getUserInRoom} = require('./controllers/chat.controller');

require("./config/passport")(passport);

app.set("trust proxy", true);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(fileUpload());

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
io.on('connection', async (socket) => {
    console.log("We have a new connection!!!")

    socket.on('chat message', (data) => {
        console.log(JSON.stringify(data))
        io.emit('chat message', data)
    })

    socket.on('join', async (data, callback) => {
        
        let {error, chatRoom} = await getChatRoom(data.chatId);

        if(!chatRoom || error) {
            if(error) return callback(error); //database error
            return callback({error: `There is no chat room by id: ${data.chatId}`});
        }

        const result = await addUser({ chatId: data.chatId, userId: data.userId, userPermission: 'user'})
        
        if(result.error) return callback(result.error);
        const {user} = result;

        console.log(user.name, user.chatName);

        socket.emit('message', {user: {username: 'admin-bot'}, text: `${user.name} welcome to the room ${user.chatName}!`})
        socket.broadcast.to(user.chatId).emit('message', {user: 'admin', text: `${user.name} has joined!`})

        socket.join(user.chatId);

        io.to(user.chatId).emit('roomData', {room: {chatId: user.chatId, name: user.chatName}, users: await getUsersInRoom(user.chatId)});

        callback(); //No errors
    })
    
    socket.on('switchRoom', async (data, callback) => {
        const {userId, chatId} = data;
        socket.join(chatId);
        //Can resend this specific roomData if need be
        callback();
    })

    socket.on('sendMessage', async (data, callback) => {
        const {userId, chatId, message} = data;
        const {user, error} = await getUserInRoom(userId, chatId);
        
        if(!user || error) {
            if(error) return callback(error); //database error
            return callback({user: {username: 'admin-bot'}, text: 'No user found'})
        }

        console.log('Retreived user: ' + JSON.stringify(user))
        console.log(`sendMessage event: ${message}`)
        io.to(user.chatId).emit('message', { user: user, text: message})
        //May need to add emit for roomData here?
        callback(); //No errors
    })

    socket.on('disconnect', () => {
        //const user = removeUser(socket.id);

        /*if(user) {
            io.to(user.room).emit('message', {user: 'admin', text: `${user.name} has left`})
            io.to(user.room).emit('roomData', {room: user.room, users: await getUsersInRoom(user.room)})
        }*/
        console.log("A user has left (disconnected)")
    })
})


app.use('', require('./routes/index'));
app.use('/users', users);
app.use('/chats', chats);

server.listen(PORT, () => console.log(`Server listening on port ${PORT}...`))