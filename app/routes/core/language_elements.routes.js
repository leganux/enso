const express = require('express');
const router = express.Router();
const api_crud = require('../../helpers/api_crud_constructor.helper');
const response_codes = require('./../../helpers/response_codes.helper').codes;
const env = require('./../../config/environment.config').environment;
const language_elements = require('./../../models/core/language_elements.m');

api_crud.all(router, language_elements, false);

module.exports = router;
