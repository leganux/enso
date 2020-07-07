const express = require('express');
const router = express.Router();
const user_role_model = require('./../models/user_roles.m');
const app_model = require('./../models/core/app.m');
const api_crud = require('../helpers/api_crud_constructor_app.helper');
const access_middleware = require('./../auth/auth.middleware').auth

api_crud.all(router, user_role_model, access_middleware, [
    {
        path: 'app',
        model: app_model
    }
], 'name');

module.exports = router;
