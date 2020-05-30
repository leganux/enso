const express = require('express');
const router = express.Router();
const api_crud = require('../../helpers/api_crud_constructor.helper');
const language_elements = require('./../../models/core/language_elements.m');
const language_list = require('./../../models/core/languages_list.m');
const access_middleware = require('./../../auth/auth.middleware').auth
api_crud.all(router, language_elements, access_middleware, {path: 'language', model: language_list}, 'element_text,element_ref');

module.exports = router;
