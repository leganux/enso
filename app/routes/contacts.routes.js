const express = require('express');
const router = express.Router();
const api_crud = require('../helpers/api_crud_constructor_app.helper');
const contacts = require('../models/contacts.m');
const access_middleware = require('./../auth/auth.middleware').auth
const app = require('./../models/core/app.m')
const dir = require('./../models/contact_direction.m')
const country = require('./../models/core/country.m')
const state = require('./../models/core/state.m')
const city = require('./../models/core/city.m')
var path = require('path');
const fs = require('fs');
const { fork } = require('child_process');
const response_codes = require('./../helpers/response_codes.helper').codes;

//api_crud.all(router, contacts, access_middleware, false, 'name');


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
    path: 'direction',
    model: dir,
    populate: [{
        path: 'country',
        model: country
    }, {
        path: 'state',
        model: state
    }, {
        path: 'city',
        model: city
    }]
}]

api_crud.datatable(router, contacts, access_middleware, populate, 'id');


router.post('/:app_id/direction', async (req, res) => {
    const body = req.body;

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

    try {
        var response = await new dir(body).save();
        if (!response) {
            res.status(433).json(response_codes.code_433);
            return 0;
        }
        let ret = response_codes.code_200;
        ret.data = response;
        res.status(200).json(ret);
        return 0;
    } catch (e) {
        console.error('*** Error en CREATE ' + dir.collection.collectionName, e);
        res.status(500).json(response_codes.code_500);
        return 0;
    }
})

router.delete("/:app_id/:id", async (req, res) => {
    var id = req.params.id;
    console.log(id)
    //verify app
    if (!get_app_id(req)) {
        res.status(533).json(response_codes.code_533)
        return 0;
    }
    try {
        var response = await contacts.findById(id);
        let deleteDirectionId = response.direction


        var deleteDirection = await dir.findByIdAndRemove(deleteDirectionId)
        if (!deleteDirection) {
            res.status(404).json(response_codes.code_404);
            return 0;
        }

        response = await contacts.findByIdAndRemove(id);
        if (!response) {
            res.status(404).json(response_codes.code_404);
            return 0;
        }

        let ret = response_codes.code_200;
        ret.data = response;
        res.status(200).json(ret);
        return 0;
    } catch (e) {
        console.error('*** Error en DELETE ' + contacts.collection.collectionName, e);
        res.status(500).json(response_codes.code_500);
        return 0;
    }


})




api_crud.create(router, contacts, access_middleware);
api_crud.update(router, contacts, access_middleware);
api_crud.updateWhere(router, contacts, access_middleware);
api_crud.readOne(router, contacts, access_middleware, populate);
api_crud.readById(router, contacts, access_middleware, populate);
api_crud.read(router, contacts, access_middleware, populate);
api_crud.updateOrCreate(router, contacts, access_middleware);
api_crud.datatable(router, contacts, access_middleware, populate, 'name');



module.exports = router;
