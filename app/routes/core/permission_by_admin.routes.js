const express = require('express');
const router = express.Router();
const api_crud = require('../../helpers/api_crud_constructor.helper');

const permises_by_admin = require('../../models/core/permission_by_admin.m');
const admin = require('../../models/core/admin.m');
const route = require('../../models/core/routes.m');

const access_middleware = require('./../../auth/auth.middleware').auth

api_crud.all(router, permises_by_admin, access_middleware, [
    {
        path: 'admin',
        model: admin
    },
    {
        path: 'route',
        model: route
    }
], undefined);

module.exports = router;
