const express = require('express');
const router = express.Router();
const admin_model = require('./../../models/core/admin.m');
const admin_role_model = require('./../../models/core/admin_role.m');
const api_crud = require('../../helpers/api_crud_constructor.helper');

const response_codes = require('./../../helpers/response_codes.helper').codes;
const env = require('./../../config/environment.config').environment;

api_crud.all(router, admin_model, false, [{path: 'role', model: admin_role_model}], 'username,email');

module.exports = router;
