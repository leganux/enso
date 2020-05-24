const express = require('express');
const router = express.Router();

router.use('/core/admin_roles', require('./core/admin_roles.routes'));
router.use('/core/admin', require('./core/admin.routes'));


module.exports = router;