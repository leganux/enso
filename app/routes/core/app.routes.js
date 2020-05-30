const express = require('express');
const router = express.Router();
const api_crud = require('../../helpers/api_crud_constructor.helper');
const app = require('./../../models/core/app.m.js');
const access_middleware = require('./../../auth/auth.middleware').auth
api_crud.all(router, app, access_middleware, false, 'name,description,token');

module.exports = router;
