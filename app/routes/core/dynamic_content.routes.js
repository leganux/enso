const express = require('express');
const router = express.Router();
const api_crud = require('../../helpers/api_crud_constructor.helper');
const dynamic_content = require('./../../models/core/dynamic_content.m');
const language = require('./../../models/core/languages_list.m');
const access_middleware = require('./../../auth/auth.middleware').auth


api_crud.all(router, dynamic_content, access_middleware, [{
    path: 'language',
    model: language
}], 'language,reference,content');

module.exports = router;
