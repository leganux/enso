const express = require('express');
const router = express.Router();
const api_crud = require('../helpers/api_crud_constructor_app.helper');
const params = require("../models/webservice_params.m");
const web = require("../models/webservice.m")
const type = require("../models/core/param_type.m")
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


        //only for owner
        if (req.who && response.owner && req.who !== '*' && response.owner != req.who) {
            res.status(403).json(response_codes.code_403);
            return 0;
        }

        response = await params.findByIdAndUpdate(id, { $set: body });

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

router.delete('/:app_id/:id/:idel', async (req, res) => {
    var id = req.params.id;
    var idel = req.params.idel;

    //verify app
    if (!get_app_id(req)) {
        res.status(533).json(response_codes.code_533)
        return 0;
    }

    try {
        var response = await params.findById(id);
        var responsetwo = await web.findById(idel);
        //only for owner
        if (req.who && response.owner && req.who !== '*' && response.owner !== req.who) {
            res.status(403).json(response_codes.code_403);
            return 0;
        }


        var help = responsetwo.params.indexOf(id)

        responsetwo.params.splice(help, 1)

        let responsethree = await web.findByIdAndUpdate(idel, { params: responsetwo.params })
        if (!responsethree) {
            res.status(433).json(response_codes.code_433);
            return 0;
        }


        response = await params.findByIdAndRemove(id);
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
