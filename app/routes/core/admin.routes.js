const express = require('express');
const router = express.Router();
const admin_model = require('./../../models/core/admin.m');
const admin_role_model = require('./../../models/core/admin_role.m');
const api_crud = require('../../helpers/api_crud_constructor.helper');

const access_middleware = require('./../../auth/auth.middleware').auth

api_crud.all(router, admin_model, access_middleware, [{path: 'role', model: admin_role_model}], 'username,email');

module.exports = router;
