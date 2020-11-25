const express = require('express');
const router = express.Router();
const api_crud = require('../helpers/api_crud_constructor_app.helper');
const contact_group = require('../models/contact_group.m');
const access_middleware = require('./../auth/auth.middleware').auth
const app = require('./../models/core/app.m')
var path = require('path');
const fs = require('fs');
const {fork} = require('child_process');
const response_codes = require('./../helpers/response_codes.helper').codes;

//api_crud.all(router, contact_group, access_middleware, false, 'name');

router.delete('/:app_id/:id', (req,res)=>{
    console.log(req)
})


api_crud.create(router, contact_group, access_middleware);
api_crud.update(router, contact_group, access_middleware);
api_crud.updateWhere(router, contact_group, access_middleware);
api_crud.readOne(router, contact_group, access_middleware, false);
api_crud.readById(router, contact_group, access_middleware, false);
api_crud.read(router, contact_group, access_middleware, false);
api_crud.updateOrCreate(router, contact_group, access_middleware);
api_crud.datatable(router, contact_group, access_middleware, false, 'name');



module.exports = router;
