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
router.use('/cloud_functions', require('./cloud_functions.routes'));
router.use('/cron_functions', require('./cron_functions.routes'));
router.use('/app_files', require('./app_files.routes'));
router.use('/contacts', require('./contacts.routes'));
router.use('/contact_group', require('./contact_group.routes'));
router.use('/mailing', require('./mailing.routes'));
router.use('/sms_gateway', require('./sms_gateway.routes'));
router.use('/contact_direction', require('./contact_direction.routes'));
router.use('/webservice', require('./webservice.routes'));
router.use('/webservice_params', require('./webservice_params.routes'));
router.use('/chatbot', require('./chatbot.routes'));


module.exports = router;