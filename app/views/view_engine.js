const express = require('express');
const router = express.Router();
const response_codes = require('../helpers/response_codes.helper').codes;
const env = require('../config/environment.config').environment;


router.get('/', function (req, res) {

    let c200 = response_codes.code_200;
    c200.data = 'Welcome o Enzō !! '
    res.status(200).json(c200);
});

router.use('/' + env.control_panel_url, require('./admin_panel'));
router.use('/', require('./website'));

module.exports = router;