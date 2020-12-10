const express = require('express');
const router = express.Router();
const api_crud = require('../helpers/api_crud_constructor_app.helper');
const sms = require('../models/sms_gateway.m');
const access_middleware = require('./../auth/auth.middleware').auth
const app = require('./../models/core/app.m')
var path = require('path');
const fs = require('fs');
const { fork } = require('child_process');
const response_codes = require('./../helpers/response_codes.helper').codes;


api_crud.all(router, sms, access_middleware, false, 'id');





module.exports = router;
