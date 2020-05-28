const express = require('express');
const router = express.Router();
const api_crud = require('../../helpers/api_crud_constructor.helper');
const response_codes = require('./../../helpers/response_codes.helper').codes;
const env = require('./../../config/environment.config').environment;
const language_elements = require('./../../models/core/language_elements.m');
const language_list = require('./../../models/core/languages_list.m');

api_crud.all(router, language_elements, false, {path: 'language', model: language_list}, 'element_text,element_ref');

module.exports = router;
