const express = require('express');
const router = express.Router();
const api_crud = require('../../helpers/api_crud_constructor.helper');
const response_codes = require('./../../helpers/response_codes.helper').codes;
const env = require('./../../config/environment.config').environment;
const dynamic_content = require('./../../models/core/dynamic_content.m');

api_crud.all(router, dynamic_content, false);

module.exports = router;
