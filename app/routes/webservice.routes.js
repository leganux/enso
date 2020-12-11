const express = require('express');
const router = express.Router();
const api_crud = require('../helpers/api_crud_constructor_app.helper');
const webservice = require('../models/webservice.m');
const params = require("../models/webservice_params.m")
const type = require("../models/param_type.m")
const group = require('../models/contact_group.m')
const access_middleware = require('./../auth/auth.middleware').auth
const app = require('./../models/core/app.m')
var path = require('path');
const fs = require('fs');
const { fork } = require('child_process');
const response_codes = require('./../helpers/response_codes.helper').codes;


var get_app_id = function (req) {
    if (!req.params || !req.params.app_id) {
        return false;
    } else {
        return req.params.app_id;
    }
}

var populate = [{
    path: 'app',
    model: app
},
{
    path: 'params',
    model: params,
    populate: [
        {
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
        }

    ]
}]


//api_crud.all(router, webservice, access_middleware, false, 'name');

router.post('/:app_id/', async (req, res) => {
    const body = req.body;
    //verify app
    if (!get_app_id(req)) {
        res.status(533).json(response_codes.code_533)
        return 0;
    }

    if (body.password) {
        body.password = await bcrypt.hash(body.password, saltRounds);
    }

    if (req.user && req.user.user) {
        body.owner = req.user.user;
    }

    body.app = get_app_id(req);
    body.params.app = body.app
    body.params.paramtype.app = body.app



    try {
        let response = await new type(body.params.paramtype).save();
        if (!response) {
            res.status(433).json(response_codes.code_433);
            return 0;
        }
        let ret = response_codes.code_200;
        ret.data = response;
        res.status(200).json(ret);

        body.params.paramtype = response._id


        let responsetwo = await new params(body.params).save()
        if (!responsetwo) {
            res.status(433).json(response_codes.code_433);
            return 0;
        }
        let rettwo = response_codes.code_200;
        rettwo.data = responsetwo;
        res.status(200).json(rettwo);

        body.params = responsetwo._id
        console.log(body.params)




        /*let responsethree = await new webservice(body).save()
        if (!responsethree) {
            res.status(433).json(response_codes.code_433);
            return 0;
        }
        let retthree = response_codes.code_200;
        retthree.data = responsethree;
        res.status(200).json(retthree);
        console.log(body)*/


        return 0;
    } catch (e) {
        console.error('*** Error en CREATE' + webservice.collection.collectionName, e);
        res.status(500).json(response_codes.code_500);
        return 0;
    }
});

api_crud.update(router, webservice, access_middleware);
api_crud.updateWhere(router, webservice, access_middleware);
api_crud.readOne(router, webservice, access_middleware, populate);
api_crud.readById(router, webservice, access_middleware, populate);
api_crud.read(router, webservice, access_middleware, populate);
api_crud.delete(router, webservice, access_middleware);
api_crud.updateOrCreate(router, webservice, access_middleware);
api_crud.datatable(router, webservice, access_middleware, populate, "name");



module.exports = router;
