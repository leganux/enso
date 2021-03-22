const express = require('express');
const router = express.Router();
const api_crud = require('../../helpers/api_crud_constructor.helper');
const origin_chatbot = require('./../../models/core/origin_chatbot');
const access_middleware = require('./../../auth/auth.middleware').auth


api_crud.all(router, origin_chatbot, access_middleware, false, 'name');

module.exports = router;
