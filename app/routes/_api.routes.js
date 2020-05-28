const express = require('express');
const router = express.Router();

router.use('/core/admin_roles', require('./core/admin_roles.routes'));
router.use('/core/admin', require('./core/admin.routes'));
router.use('/core/app', require('./core/app.routes'));
router.use('/core/cdn', require('./core/cdn.routes'));
router.use('/core/permises/admin', require('./core/permises_by_admin.routes'));
router.use('/core/permises/role', require('./core/permises_by_rol.routes'));
router.use('/core/routes/', require('./core/routes_admin.routes'));

router.use('/places/city', require('./core/city.routes'));
router.use('/places/country', require('./core/country.routes'));
router.use('/places/state', require('./core/state.routes'));

router.use('/i18n/language_list', require('./core/language_list.routes'));
router.use('/i18n/language_elements', require('./core/language_elements.routes'));
router.use('/i18n/dynamic_content', require('./core/dynamic_content.routes'));


module.exports = router;