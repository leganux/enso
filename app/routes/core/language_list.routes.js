const express = require('express');
const router = express.Router();
const api_crud = require('../../helpers/api_crud_constructor.helper');
const response_codes = require('./../../helpers/response_codes.helper').codes;
const env = require('./../../config/environment.config').environment;
const language_list = require('./../../models/core/languages_list.m');

api_crud.all(router, language_list, false);

module.exports = router;
