const express = require('express');
const router = express.Router();


// App API
router.use('/user_roles', require('./user_roles.routes'));
router.use('/user', require('./user.routes'));
router.use('/routes', require('./routes_user.routes'));
router.use('/permission/role', require('./user_permission_by_rol.routes'));
router.use('/db/collection', require('./dynamic_db_collection.routes'));
router.use('/db/structure', require('./dynamic_db_structure.routes'));
router.use('/db/data', require('./dynamic_db_data.routes'));


module.exports = router;