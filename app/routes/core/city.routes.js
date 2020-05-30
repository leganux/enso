const express = require('express');
const router = express.Router();
const api_crud = require('../../helpers/api_crud_constructor.helper');
const city = require('./../../models/core/city.m');
const access_middleware = require('./../../auth/auth.middleware').auth


api_crud.all(router, city, access_middleware, false, 'name');

module.exports = router;
