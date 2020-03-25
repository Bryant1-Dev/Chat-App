const express = require('express')
const router = express.Router();

const userController = require('./../controllers/users.controller');
const chatController = require('./../controllers/chat.controller');
const notificationController = require('./../controllers/notification.controller');

router.post('/', userController.isAuthenticated, notificationController.retrieveUserNotifications);

module.exports = router;