const express = require('express')
const router = express.Router();

const userController = require('./../controllers/users.controller');
const chatController = require('./../controllers/chat.controller');

router.post('/', userController.isAuthenticated, chatController.retrieveUserChats);
router.post('/create', userController.isAuthenticated, chatController.createChatRoom);
router.post('/invite', userController.isAuthenticated, chatController.inviteUserToChatRoom);

module.exports = router;