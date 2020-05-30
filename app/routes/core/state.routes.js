const express = require('express');
const router = express.Router();
const api_crud = require('../../helpers/api_crud_constructor.helper');
const state = require('./../../models/core/state.m');
const access_middleware = require('./../../auth/auth.middleware').auth
api_crud.all(router, state, access_middleware, false, 'name');

module.exports = router;
