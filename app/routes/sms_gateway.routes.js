const express = require('express');
const router = express.Router();
const api_crud = require('../helpers/api_crud_constructor_app.helper');
const sms = require('../models/sms_gateway.m');
const smsToSend = require('../models/smsToSend.m');
const access_middleware = require('./../auth/auth.middleware').auth
const appModel = require('./../models/core/app.m')
var path = require('path');
const fs = require('fs');
const {fork} = require('child_process');
const response_codes = require('./../helpers/response_codes.helper').codes;
const axios = require('axios')
const user = require('./../models/users.m')

var get_app_id = function (req) {
    if (!req.params || !req.params.app_id) {
        return false;
    } else {
        return req.params.app_id;
    }
}
//api_crud.all(router, sms, access_middleware, false, 'id');

api_crud.updateOrCreate(router, sms, access_middleware);
api_crud.create(router, sms, access_middleware);
api_crud.update(router, sms, access_middleware);
api_crud.updateWhere(router, sms, access_middleware);
api_crud.readOne(router, sms, access_middleware, false);
api_crud.read(router, sms, access_middleware, false);

api_crud.delete(router, sms, access_middleware);
api_crud.datatable(router, sms, access_middleware, false, 'id');

router.get('/unsended/:app', async function (req, res) {
    let {app} = req.params
    console.log(req.query)
    let {USER, PASS} = req.query


    let myApp = await appModel.findById(app)
    if (!myApp) {
        res.status(404).json(response_codes.code_404)
        return 0;
    }
    if(myApp.gateway_user != USER){
        res.status(404).json(response_codes.code_404)
        return 0;
    }
    if(myApp.gateway_password != PASS){
        res.status(404).json(response_codes.code_404)
        return 0;
    }


    try {

        let allmessage = await smsToSend.find({app: app})

        console.log("allmeessage", allmessage)

        let resp = response_codes.code_200
        resp.data = allmessage
        res.status(200).json(resp)
        for(let item of allmessage){
            await item.remove()
        }
    } catch (e) {
        console.error(e)
        res.status(500).json(response_codes.code_500)
        return 0
    }
})

router.post('/saveTOSend/:app_id',async function (req,res){
    let body = req.body;
    //verify app
    console.log(req.params)
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
    console.log(body)
    try {
        for(let item of body.Number){
            var response = await new smsToSend({
                messageText: body.messageText,
                Number: item,
                app: body.app
            })
            response = await response.save()
            if (!response) {
                res.status(433).json(response_codes.code_433);
                return 0;
            }
        }

        let ret = response_codes.code_200;
        ret.data = response;
        res.status(200).json(ret);
        return 0;
    } catch (e) {
        console.error('*** Error en CREATE ' + model.collection.collectionName, e);
        res.status(500).json(response_codes.code_500);
        return 0;
    }
})
api_crud.readById(router, sms, access_middleware, false);

module.exports = router;
