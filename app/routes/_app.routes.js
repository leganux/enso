const express = require('express');
const router = express.Router();



// App API
router.use('/user_roles', require('./user_roles.routes'));
router.use('/user', require('./user.routes'));


module.exports = router;