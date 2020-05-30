const express = require('express');
const router = express.Router();
const api_crud = require('../../helpers/api_crud_constructor.helper');

const cdn = require('./../../models/core/cdn.m');

const access_middleware = require('./../../auth/auth.middleware').auth
api_crud.all(router, cdn, access_middleware, false, 'url,name,description');

module.exports = router;
