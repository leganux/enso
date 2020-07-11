const express = require('express');
const router = express.Router();
const api_crud = require('../helpers/api_crud_constructor_app.helper');
const response_codes = require('./../helpers/response_codes.helper').codes;
const env = require('./../config/environment.config').environment;
const fields = require('./../models/dynamic_db_structure.m');
const access_middleware = require('./../auth/auth.middleware').auth


api_crud.all(router, fields, access_middleware, false, 'url,description,type,name');

module.exports = router;
