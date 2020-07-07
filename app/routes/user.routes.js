const express = require('express');
const router = express.Router();
const user_model = require('./../models/users.m');
const user_role_model = require('./../models/user_roles.m');
const app_model = require('./../models/user_roles.m');
const api_crud = require('../helpers/api_crud_constructor_app.helper');

const access_middleware = require('./../auth/auth.middleware').auth

api_crud.all(router, user_model, access_middleware,
    [
        {
            path: 'role',
            model: user_role_model
        },
        {
            path: 'app',
            model: app_model
        }],
    'username,email');

module.exports = router;
