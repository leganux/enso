const express = require('express');
const router = express.Router();
const api_crud = require('../../helpers/api_crud_constructor.helper');
const response_codes = require('./../../helpers/response_codes.helper').codes;
const env = require('./../../config/environment.config').environment;
const cdn = require('./../../models/core/cdn.m');

api_crud.all(router, cdn, false, false, 'url,name,description');

module.exports = router;
