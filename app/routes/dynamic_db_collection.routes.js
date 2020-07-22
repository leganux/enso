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

        let database = await dynamic_db_collection.find({app: app_id})
            .populate({path: 'fields', model: fields})
            .exec();

        if (!database) {
            res.status(404).json(response_codes.code_404)
            return 0;
        }

        let folder_dir_out = '../../cloud/app_' + my_app._id + '/';


        let construccion = `
        const mongoose = require('./db_connection');
        const {Schema} = require('mongoose');
        const moment = require('moment');
        const dataTables = require('mongoose-datatables');
        
        let schemas = {};
        let models = {};
        
        function gen_id(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
        }
        
        `;

        for (var i = 0; i < database.length; i++) {
            let item = database[i];
            let name = item.name;
            let fields = item.fields;
            construccion = construccion + 'schemas["' + name + '"] = new Schema({'
            for (var j = 0; j < fields.length; j++) {
                let jtem = fields[j];
                let inner = '';

                try {
                    switch (jtem.kind) {
                        case 'string':
                            inner = 'type:String,\n '
                            break;
                        case 'number':
                            inner = 'type:Number,\n '
                            break;
                        case 'boolean':
                            inner = 'type:Boolean,\n '
                            break;
                        case 'date':
                            inner = 'type:Date,\n '
                            break;
                        case 'buffer':
                            inner = 'type:Buffer,\n '
                            break;
                        case 'mixed':
                            inner = 'type:Mixed,\n '
                            break;
                        case 'array':
                            inner = 'type:Array,\n '
                            break;
                        case 'oid_array':
                            inner = 'type:[Schema.Types.ObjectId],'
                            var f = await dynamic_db_collection.findById(jtem.related);
                            console.log(f.name, f)
                            if (f) {
                                inner = inner + 'ref:models["' + f.name + '"],\n '
                            }
                            break;
                        case 'oid_single':
                            inner = 'type:Schema.Types.ObjectId,'
                            var f = await dynamic_db_collection.findById(jtem.related);
                            console.log(f.name, f)
                            if (f) {
                                inner = inner + 'ref:models["' + f.name + '"],\n'
                            }
                            break;
                    }
                    if (jtem.mandatory) {
                        inner = inner + 'required:true,\n'
                    }
                    if (jtem.default) {
                        switch (jtem.default_type) {
                            case 'timestamp':
                                inner = inner + 'default:moment().format(),\n'
                                break;
                            case 'math_random':
                                inner = inner + 'default:Math.random(),\n'
                                break;
                            case 'string_random':
                                inner = inner + 'default:gen_id(11),\n'
                                break;
                            case 'custom':
                                inner = inner + 'default:' + jtem.defult_custom + ', \n'
                                break;
                        }
                    }
                } catch (e) {
                    console.error(e)
                }
                construccion = construccion + jtem.name + ':{' + inner + '}, \n';
            }
            construccion = construccion + '});'
            construccion = construccion + '\n schemas["' + name + '"].plugin(dataTables); \n '
            construccion = construccion + '\n models["' + name + '"]= mongoose.model("' + name + '", schemas["' + name + '"], "dynamic_db_' + name + '"); \n';
        }
        construccion = construccion + '  module.exports = {models, schemas, mongoose};'
        fs.writeFileSync(path.join(__dirname, folder_dir_out, 'db.js'), construccion);
        res.status(200).json(response_codes.code_200)

    } catch (e) {
        console.error(e)
        res.status(500).json(response_codes.code_500)
        return 0
    }


});

module.exports = router;
