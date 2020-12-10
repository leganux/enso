const express = require('express');
const router = express.Router();
const api_crud = require('../helpers/api_crud_constructor_app.helper');
const webservice = require('../models/webservice.m');
const access_middleware = require('./../auth/auth.middleware').auth
const app = require('./../models/core/app.m')
var path = require('path');
const fs = require('fs');
const { fork } = require('child_process');
const response_codes = require('./../helpers/response_codes.helper').codes;


api_crud.all(router, webservice, access_middleware, false, 'id');

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




module.exports = router;
