const express = require('express');
const router = express.Router();
const api_crud = require('../../helpers/api_crud_constructor.helper');
const language_list = require('./../../models/core/languages_list.m');
const access_middleware = require('./../../auth/auth.middleware').auth
api_crud.all(router, language_list, access_middleware);

module.exports = router;
