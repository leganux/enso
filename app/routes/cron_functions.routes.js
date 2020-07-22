const express = require('express');
const router = express.Router();
const api_crud = require('../helpers/api_crud_constructor_app.helper');
const cloud_functions = require('../models/cloud_functions.m');
const access_middleware = require('./../auth/auth.middleware').auth
const app = require('./../models/core/app.m')
var path = require('path');
const fs = require('fs');
const {fork} = require('child_process');
const response_codes = require('./../helpers/response_codes.helper').codes;

var cron = require('node-cron');
var cb = require('cron-builder');
let moment = require('moment')

api_crud.all(router, cloud_functions, access_middleware, false, 'name');

router.post('/rebuild/:app_id', access_middleware, async function (req, res) {

    let {app_id} = req.params;

    if (!app_id) {
        res.status(404).json(response_codes.code_404)
        return 0;
    }

    try {
        let my_app = await app.findById(app_id);
        if (!my_app) {
            res.status(404).json(response_codes.code_404)
            return 0;
        }

        let functions = await cloud_functions.find({app: app_id})
            .exec();

        if (!functions) {
            res.status(404).json(response_codes.code_404)
            return 0;
        }

        let folder_dir_out = '../../cloud/app_' + my_app._id + '/functions/';


        let construccion = `
        let models =  require('./../db');
        let getModelByName = function(name){
        return models[name]; 
        }
        
        var list_function = {};
        
       
        `;

        for (var i = 0; i < functions.length; i++) {
            let item = functions[i];
            construccion = construccion + ' list_function["' + item.name + '"]  = ' + item.content;
        }


        construccion = construccion + ' \n  module.exports =list_function; '

        fs.writeFileSync(path.join(__dirname, folder_dir_out, 'main.js'), construccion);
        res.status(200).json(response_codes.code_200)

    } catch (e) {
        console.error(e)
        res.status(500).json(response_codes.code_500)
        return 0
    }

});


module.exports = router;
