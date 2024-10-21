const express = require('express');
const botController = require('../controllers/botController');
const router = express.Router();

router.post('/create-bot', botController.createBot);
router.post('/start-all', botController.startAllBots);

module.exports = router;
