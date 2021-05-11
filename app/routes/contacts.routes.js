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
const direction = require('../models/contact_direction.m')
const group = require('../models/contact_group.m')
var path = require('path');
const fs = require('fs');
const { fork } = require('child_process');
const { model } = require('./../models/core/country.m');
const response_codes = require('./../helpers/response_codes.helper').codes;
const moment = require('moment');

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
    path: 'group',
    model: group
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
    let body = req.body;

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
    console.log("id",id)
    //verify app
    if (!get_app_id(req)) {
        res.status(533).json(response_codes.code_533)
        return 0;
    }
    try {
        var response = await contacts.findById(id);
        let deleteDirectionId = response.direction


        var deleteDirection = await dir.findByIdAndRemove(deleteDirectionId)


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

//create method
router.post('/:app_id/',  async (req, res) => {
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
    body.direction.app = body.app


    try {
        let response = await new direction(body.direction).save();
        if (!response) {
            res.status(433).json(response_codes.code_433);
            return 0;
        }
        let ret = response_codes.code_200;
        ret.data = response;
        res.status(200).json(ret);

        body.direction._id = response._id

        let responsetwo = await new contacts(body).save()
        if (!responsetwo) {
            res.status(433).json(response_codes.code_433);
            return 0;
        }
        let rettwo = response_codes.code_200;
        rettwo.data = responsetwo;
        res.status(200).json(rettwo);
        

        return 0;
    } catch (e) {
        console.error('*** Error en CREATE' + contacts.collection.collectionName, e);
        res.status(500).json(response_codes.code_500);
        return 0;
    }
});

//update method
router.put('/:app_id/:id', async function (req, res) {
    let body = req.body;
    
    let direction = body.direction
    let id = req.params.id;

    body.updatedAt = moment().format();
    //verify app
    if (!get_app_id(req)) {
        res.status(533).json(response_codes.code_533)
        return 0;
    }

    try {
       
        var response = await contacts.findById(id)
        console.log("direction",direction)
        console.log(response)
        let dirid = response.direction
        console.log(dirid)


        //only for owner
        if (req.who && response.owner && req.who !== '*' && response.owner != req.who) {
            res.status(403).json(response_codes.code_403);
            return 0;
        }

        let responsedir = await dir.findByIdAndUpdate(dirid, {$set: direction})
        if(!responsedir){
            responsedir = await new dir(direction)
            responsedir.app = response.app
            responsedir = await responsedir.save()
        }
        body.direction = responsedir._id

        response = await contacts.findByIdAndUpdate(id, {$set: body});

        if (!response || !responsedir) {
            res.status(434).json(response_codes.code_434);
            return 0;
        }

        let ret = response_codes.code_200;
        ret.data = response;
        res.status(200).json(ret);
        return 0;

    } catch (e) {
        console.error('*** Error en UPDATE ' + contacts.collection.collectionName, e);
        res.status(500).json(response_codes.code_500);
        return 0;
    }
});

router.post('/phone/:app_id/',  async (req, res) => {
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


    try {

        let responsetwo = await new contacts(body).save()
        if (!responsetwo) {
            res.status(433).json(response_codes.code_433);
            return 0;
        }
        let rettwo = response_codes.code_200;
        rettwo.data = responsetwo;
        res.status(200).json(rettwo);


        return 0;
    } catch (e) {
        console.error('*** Error en CREATE' + contacts.collection.collectionName, e);
        res.status(500).json(response_codes.code_500);
        return 0;
    }
});



api_crud.updateWhere(router, contacts, access_middleware);
api_crud.readOne(router, contacts, access_middleware, populate);
api_crud.readById(router, contacts, access_middleware, populate);
api_crud.read(router, contacts, access_middleware, populate);
api_crud.updateOrCreate(router, contacts, access_middleware);
api_crud.datatable(router, contacts, access_middleware, populate, 'name');



module.exports = router;
