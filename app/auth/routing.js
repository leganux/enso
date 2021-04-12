const express = require('express');
const router = express.Router();

router.use('/admin', require('./strategies/admin'));
router.use('/user', require('./strategies/user'));
router.use('/login/gettoken', require('./strategies/login'));
router.use('/login_user/gettoken', require('./strategies/login_user'));

module.exports = {router};