const express = require('express');
const botController = require('../controllers/botController');
const router = express.Router();

router.post('/create-bot', botController.createBot);
router.get('/start-all', botController.startAllBots);
router.delete('/remove-bot', botController.removeBot);

module.exports = router;
