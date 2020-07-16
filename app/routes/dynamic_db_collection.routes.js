const express = require('express');
const router = express.Router();
const api_crud = require('../helpers/api_crud_constructor_app.helper');
const response_codes = require('./../helpers/response_codes.helper').codes;
const env = require('./../config/environment.config').environment;
const dynamic_db_collection = require('./../models/dynamic_db_collection.m');
const fields = require('./../models/dynamic_db_structure.m');
const access_middleware = require('./../auth/auth.middleware').auth
const app = require('./../models/core/app.m');

var path = require('path');
const fs = require('fs');


api_crud.all(router, dynamic_db_collection, access_middleware, [{
    path: 'fields',
    model: fields
}], 'url,description,type,name');

router.post('/field/:id/:app_id', access_middleware, async function (req, res) {
    let body = req.body;
    let params = req.params;

    if (!params.id || !params.app_id) {
        res.status(404).json(response_codes.code_404)
        return 0
    }

    try {
        let collection = await dynamic_db_collection.findById(params.id);
        if (!collection) {
            res.status(404).json(response_codes.code_404)
            return 0
        }

        body.app = params.app_id

        let field = new fields(body)
        field = await field.save()

        collection.fields.push(field._id);
        collection = await collection.save()

        let response = response_codes.code_200;
        response.data = collection
        res.status(200).json(response)
        return 1

    } catch (e) {
        console.error(e)
        res.status(500).json(response_codes.code_500)
        return 0
    }


});

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

        let database = await dynamic_db_collection.findOne({app: app_id})
            .populate({path: 'fields', model: fields})
            .exec();

        if (!database) {
            res.status(404).json(response_codes.code_404)
            return 0;
        }

        let folder_dir_out = '../../cloud/app_' + my_app._id + '/';


        let construccion = 'OK'

        fs.writeFileSync(path.join(__dirname, folder_dir_out, 'db.js'), construccion);
        res.status(200).json('')

    } catch (e) {
        console.error(e)
        res.status(500).json(response_codes.code_500)
        return 0
    }


});

module.exports = router;
