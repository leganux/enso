const express = require('express');
const router = express.Router();
const api_crud = require('../helpers/api_crud_constructor_app.helper');
const cloud_functions = require('../models/cloud_functions.m');
const access_middleware = require('./../auth/auth.middleware').auth

api_crud.all(router, cloud_functions, access_middleware, false, 'name');


module.exports = router;
