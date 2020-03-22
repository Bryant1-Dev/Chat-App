const bcrypt = require("bcryptjs");
const {User, Notification, Chat, Message, ChatParticipant, FriendRequest} = require('../models/test.js');

function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

function validatePassword(passowrd) {
     bcrypt.compareSync(password, this.password);
}

exports.isAuthenticated = (req, res, next) => {
    if(!req.isAuthenticated()) return res.send({message: 'This user is not logged in', payload: {}});
    next();
}

exports.validateRegister = async (req, res, next) => {
    
    const errors = [];
    console.log(JSON.stringify(req.body))
    //Ensure all fields are present
    if(!req.body) {
        errors.push({messsage: 'Please fill out all form fields.'})
        return res.send({
            success: false,
            errors
        })
    }

    const {username, email, password, confirmPassword} = req.body;
    
    if(!username || !email || !password || !confirmPassword) {
        errors.push({messsage: 'Please fill out all form fields.'});
    }

    if(password.length < 6) {
        errors.push({messsage: 'Please make your password longer than 6 characters.'});
    }

    if(password !== confirmPassword) {
        errors.push({messsage: 'Your passwords do not match.'});
    }

    if(errors.length > 0) {
        return res.send({
            success: false,
            errors
        })
    }

    const users = await User.findAll({
        where: {
            username: username
        }
    });

    if(users.length > 0) {
        errors.push({messsage: 'This username is already taken'});
        return res.send({
            success: false,
            errors
        })
    }
    console.log("Finished validating register input");
    next();
    
}

exports.registerUser = (req, res) => {
    const {username, email, password} = req.body;

    User.create({
        username: username,
        password: generateHash(password),
        email: email,
        settings: {
            currentTheme: 'normal',
            recieveNotifications: true
        }
    })
    .then((user, error) => {
        if(error) {
            console.log(error);
            return res.send({
            success: false,
            errors
            })
        }

        console.log(`${username} has succssfully registered for an account!`);

        res.send({
            success: true,
            message: `${username} has succssfully registered for an account!`
        })
    })
}




 