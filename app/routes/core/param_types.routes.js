const express = require('express');
const router = express.Router();
const api_crud = require('../../helpers/api_crud_constructor_app.helper');
const response_codes = require('../../helpers/response_codes.helper').codes;
const env = require('../../config/environment.config').environment;
const type = require("../../models/core/param_type.m")
const params = require("../../models/webservice_params.m")
const web = require("../../models/webservice.m")

const access_middleware = require('../../auth/auth.middleware').auth


api_crud.all(router, type, access_middleware, false, 'key');

module.exports = router;
