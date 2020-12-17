const express = require('express');
const router = express.Router();
const types = require("./../../models/core/param_type.m")
const api_crud = require('./../../helpers/api_crud_constructor.helper');
const response_codes = require('../../helpers/response_codes.helper').codes;
const env = require('../../config/environment.config').environment;
const access_middleware = require('./../../auth/auth.middleware').auth



api_crud.all(router, types , access_middleware, false, 'key');

module.exports = router;
