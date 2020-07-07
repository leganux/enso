const express = require('express');
const router = express.Router();
const api_crud = require('../helpers/api_crud_constructor_app.helper');

const permises_by_rol = require('../models/user_permission_by_rol.m');
const role = require('../models/user_roles.m');

const route = require('../models/routes_user.m');

const access_middleware = require('./../auth/auth.middleware').auth

api_crud.all(router, permises_by_rol, access_middleware, [
    {
        path: 'role',
        model: role
    },
    {
        path: 'route',
        model: route
    }
], undefined);


module.exports = router;
