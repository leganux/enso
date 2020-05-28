const express = require('express');
const router = express.Router();
const api_crud = require('../../helpers/api_crud_constructor.helper');
const response_codes = require('./../../helpers/response_codes.helper').codes;
const env = require('./../../config/environment.config').environment;
const app = require('./../../models/core/app.m.js');

api_crud.all(router, app, false,false,'name,description,token');

module.exports = router;
