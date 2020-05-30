const express = require('express');
const router = express.Router();
const api_crud = require('../../helpers/api_crud_constructor.helper');
const dynamic_content = require('./../../models/core/dynamic_content.m');
const access_middleware = require('./../../auth/auth.middleware').auth
api_crud.all(router, dynamic_content, access_middleware);

module.exports = router;
