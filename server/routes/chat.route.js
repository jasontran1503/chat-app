const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const chatController = require('../controllers/chat.controller');
const validator = require('../helpers/validator');

router.post('/new-message', auth.guard, chatController.createMessage);
router.post('/chat-room', auth.guard, chatController.createRoom);
router.get('/available-rooms', auth.guard, chatController.getAvailableRooms);
router.get('/room', auth.guard, chatController.getRoomInfo);
router.get('/conversation', auth.guard, chatController.getConversation);

module.exports = router;
