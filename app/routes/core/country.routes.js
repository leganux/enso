const express = require('express');
const router = express.Router();
const api_crud = require('../../helpers/api_crud_constructor.helper');
const country = require('./../../models/core/country.m');
const access_middleware = require('./../../auth/auth.middleware').auth
api_crud.all(router, country, access_middleware, false, 'name,sortname,phonecode');

module.exports = router;
