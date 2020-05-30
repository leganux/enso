const express = require('express');
const router = express.Router();
const api_crud = require('../../helpers/api_crud_constructor.helper');
const response_codes = require('./../../helpers/response_codes.helper').codes;
const env = require('./../../config/environment.config').environment;
const routes_admin = require('./../../models/core/routes.m');

const access_middleware = require('./../../auth/auth.middleware').auth
api_crud.all(router, routes_admin, access_middleware, false, 'url,description,type');

module.exports = router;
