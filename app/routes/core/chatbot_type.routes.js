const express = require('express');
const router = express.Router();
const api_crud = require('../../helpers/api_crud_constructor.helper');
const chatbot_type = require('./../../models/core/chetbot_type.m');
const access_middleware = require('./../../auth/auth.middleware').auth


api_crud.all(router, chatbot_type, access_middleware, false, 'name');

module.exports = router;
