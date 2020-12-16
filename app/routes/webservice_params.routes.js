const express = require('express');
const router = express.Router();
const api_crud = require('../helpers/api_crud_constructor_app.helper');
const params = require("../models/webservice_params.m")
const type = require("../models/param_type.m")
const access_middleware = require('./../auth/auth.middleware').auth
const app = require('./../models/core/app.m')
var path = require('path');
const fs = require('fs');
const { fork } = require('child_process');
const response_codes = require('./../helpers/response_codes.helper').codes;
const { findById, findByIdAndUpdate } = require('./../models/core/app.m');
const moment = require('moment');


var populate = [{

    path: 'app',
    model: app
},
{
    path: 'paramtype',
    model: type,
    populate: [{
        path: 'app',
        model: app
    }]

}]

var get_app_id = function (req) {
    if (!req.params || !req.params.app_id) {
        return false;
    } else {
        return req.params.app_id;
    }
}

//api_crud.all(router, params, access_middleware, populate, 'name');


router.put('/:app_id/:id', async function (req, res) {
    let body = req.body;
    let id = req.params.id;
    let typeID

    body.updatedAt = moment().format();

    console.log(body.paramtype)
    //verify app
    if (!get_app_id(req)) {
        res.status(533).json(response_codes.code_533)
        return 0;
    }

    try {
        if (body.password) {
            body.password = await bcrypt.hash(body.password, saltRounds);
        }
        var response = await params.findById(id)
        console.log(response)

        typeID = response.paramtype
        //only for owner
        if (req.who && response.owner && req.who !== '*' && response.owner != req.who) {
            res.status(403).json(response_codes.code_403);
            return 0;
        }


        responsetwo = await type.findByIdAndUpdate(typeID, { $set: body.paramtype });
        console.log(responsetwo)
        if (!responsetwo) {
            res.status(434).json(response_codes.code_434);
            return 0;
        }
        body.paramtype = responsetwo._id

        response = await params.findByIdAndUpdate(id, { $set: body });
        console.log(response)
        if (!response) {
            res.status(434).json(response_codes.code_434);
            return 0;
        }
        let ret = response_codes.code_200;
        ret.data = response;
        res.status(200).json(ret);
        return 0;

    } catch (e) {
        console.error('*** Error en UPDATE ' + params.collection.collectionName, e);
        res.status(500).json(response_codes.code_500);
        return 0;
    }
});

router.delete('/:app_id/:id', async (req, res) => {
    var id = req.params.id;
    let typeid


    //verify app
    if (!get_app_id(req)) {
        res.status(533).json(response_codes.code_533)
        return 0;
    }


    try {
        var response = await params.findById(id);
        //only for owner
        if (req.who && response.owner && req.who !== '*' && response.owner !== req.who) {
            res.status(403).json(response_codes.code_403);
            return 0;
        }

        console.log(response.paramtype)
        typeid = response.paramtype

        responsetwo = await type.findByIdAndRemove(typeid);
        console.log(responsetwo)
        if (!responsetwo) {
            res.status(404).json(response_codes.code_404);
            return 0;
        }

        response = await params.findByIdAndRemove(id);
        console.log(response)
        if (!response) {
            res.status(404).json(response_codes.code_404);
            return 0;
        }

        let ret = response_codes.code_200;
        ret.data = response;
        res.status(200).json(ret);
        return 0;

    } catch (e) {
        console.error('*** Error en DELETE ' + params.collection.collectionName, e);
        res.status(500).json(response_codes.code_500);
        return 0;
    }

});




api_crud.create(router, params, access_middleware);
api_crud.updateWhere(router, params, access_middleware);
api_crud.readOne(router, params, access_middleware, populate);
api_crud.readById(router, params, access_middleware, populate);
api_crud.read(router, params, access_middleware, populate);
api_crud.updateOrCreate(router, params, access_middleware);
api_crud.datatable(router, params, access_middleware, populate, "name");





module.exports = router;
