const express = require('express');
const router = express.Router();


// App API
router.use('/user_roles', require('./user_roles.routes'));
router.use('/user', require('./user.routes'));
router.use('/user_routes', require('./routes_user.routes'));
router.use('/user_permission', require('./user_permission_by_rol.routes'));


module.exports = router;