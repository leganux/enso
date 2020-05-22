const express = require('express');
const router = express.Router();

router.use('/admin', require('./strategies/admin'));

module.exports = {router};