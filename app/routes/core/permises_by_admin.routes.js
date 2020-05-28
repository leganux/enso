const express = require('express');
const router = express.Router();
const api_crud = require('../../helpers/api_crud_constructor.helper');
const response_codes = require('./../../helpers/response_codes.helper').codes;
const env = require('./../../config/environment.config').environment;
const permises_by_admin = require('./../../models/core/permises_by_admin.m');

api_crud.all(router, permises_by_admin, false);

module.exports = router;
