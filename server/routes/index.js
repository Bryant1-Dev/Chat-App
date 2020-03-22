const express = require('express')
const router = express.Router();
const {User, Notification, Chat, Message, ChatParticipant, FriendRequest} = require('../models/test.js');


router.get('/', (req, res) => {
    res.send('Server is up and running');
})

router.get('/create-user', async (req, res) => {
    const user = await User.create({
        username: 'Ryousuke',
        password: 'sadface',
        email: 'bwilkins1@ufl.edu',
        settings: {
            currentTheme: 'normal',
            recieveNotifications: true
        }
    })
    console.log(user);
    console.log(JSON.stringify(user));
    res.send(JSON.stringify(user));
})

router.get('/view-users', async (req, res) => {
    // Find all users
    const users = await User.findAll();
    console.log("All users:", JSON.stringify(users, null, 2));
    let testString = "All users:" + JSON.stringify(users, null, 2);
    res.send(testString);
})
module.exports = router;