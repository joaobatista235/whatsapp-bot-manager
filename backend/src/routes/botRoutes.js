const express = require('express');
const botController = require('../controllers/botController');

const router = express.Router();

router.post('/create-bot', botController.createBot);

module.exports = router;
