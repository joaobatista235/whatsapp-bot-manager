const express = require('express');
const cors = require('cors');
const botRoutes = require('../routes/botRoutes');
const errorHandler = require('../utils/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', botRoutes);
app.use(errorHandler);

module.exports = app;
