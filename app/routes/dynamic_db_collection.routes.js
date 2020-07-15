const express = require('express');
const router = express.Router();
const api_crud = require('../helpers/api_crud_constructor_app.helper');
const response_codes = require('./../helpers/response_codes.helper').codes;
const env = require('./../config/environment.config').environment;
const dynamic_db_collection = require('./../models/dynamic_db_collection.m');
const fields = require('./../models/dynamic_db_structure.m');
const access_middleware = require('./../auth/auth.middleware').auth


api_crud.all(router, dynamic_db_collection, access_middleware, [{
    path: 'fields',
    model: fields
}], 'url,description,type,name');

router.post('/field/:app_id', access_middleware, async function (req, res) {
    let body = req.body;
});

module.exports = router;
