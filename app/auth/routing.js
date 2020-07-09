const express = require('express');
const router = express.Router();

router.use('/admin', require('./strategies/admin'));
router.use('/user', require('./strategies/user'));

module.exports = {router};