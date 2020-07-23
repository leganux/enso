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
        let db =  require('./../db');
        let mongoose =  require('./../db').mongoose;
        let getModelByName = function(name){
        return db.models[name]; 
        }
        let getSchemaByName = function(name){
        return db.schemas[name]; 
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

router.get('/exec/:app_id/:name', access_middleware, async function (req, res) {
    let {app_id, name} = req.params;
    let {body, query, params, headers} = req;
    let requirement = {body, query, params, headers};

    if (!name) {
        res.status(401).json(response_codes.code_401)
        return 0;
    }
    if (!app_id) {
        res.status(533).json(response_codes.code_533)
        return 0;
    }
    try {
        let my_app = await app.findById(app_id);
        if (!my_app) {
            res.status(533).json(response_codes.code_533)
            return 0;
        }
        if (!my_app.deployed) {
            res.status(534).json(response_codes.code_534)
            return 0;
        }
        let my_function_ = await cloud_functions.findOne({
            app: app_id,
            name: name,
            //method: 'GET',
            // active: true
        });

        if (!my_function_) {
            res.status(404).json(response_codes.code_404)
            return 0
        }

        if (!my_function_.active) {
            res.status(437).json(response_codes.code_537)
            return 0
        }
        if (my_function_.method !== 'GET') {
            res.status(405).json(response_codes.code_405)
            return 0
        }


        // action
        let send = {
            kind: 'FUNCTION',
            method: 'GET',
            req: requirement,
            app_id: app_id,
            function_name: name,
            who: req.who
        }

        let folder_dir_out = '../../cloud/app_' + my_app._id + '/';

        const forked = fork(path.join(__dirname, folder_dir_out, 'index.js'),
            [],
            {
                cwd: path.join(__dirname, folder_dir_out),
            });

        forked.send(send);
        forked.on('error', (error) => {
            console.error(error)
            res.status(500).json(response_codes.code_500)
            return 0
        });
        forked.on('exit', (error) => {
            console.error(error)
            res.status(500).json(response_codes.code_500)
            return 0
        });
        forked.on('message', (message) => {

            if (message.error) {
                console.error(message.error)
                res.status(500).json(response_codes.code_500)
                return 0
            } else if (message.end) {
                let resp = response_codes.code_200
                resp.data = message.data
                res.status(200).json(resp)
                return 0
            } else if (!message.end) {

            }
        });


    } catch (e) {
        console.error(e)
        res.status(500).json(response_codes.code_500)
        return 0
    }
});

router.post('/exec/:app_id/:name', access_middleware, async function (req, res) {
    let {app_id, name} = req.params;
    let {body, query, params, headers} = req;
    let requirement = {body, query, params, headers};

    if (!name) {
        res.status(401).json(response_codes.code_401)
        return 0;
    }
    if (!app_id) {
        res.status(533).json(response_codes.code_533)
        return 0;
    }
    try {
        let my_app = await app.findById(app_id);
        if (!my_app) {
            res.status(533).json(response_codes.code_533)
            return 0;
        }
        if (!my_app.deployed) {
            res.status(534).json(response_codes.code_534)
            return 0;
        }
        let my_function_ = await cloud_functions.findOne({
            app: app_id,
            name: name,
            //method: 'GET',
            // active: true
        });

        if (!my_function_) {
            res.status(404).json(response_codes.code_404)
            return 0
        }

        if (!my_function_.active) {
            res.status(437).json(response_codes.code_537)
            return 0
        }
        if (my_function_.method !== 'POST') {
            res.status(405).json(response_codes.code_405)
            return 0
        }


        // action
        let send = {
            kind: 'FUNCTION',
            method: 'POST',
            req: requirement,
            app_id: app_id,
            function_name: name,
            who: req.who
        }

        let folder_dir_out = '../../cloud/app_' + my_app._id + '/';

        const forked = fork(path.join(__dirname, folder_dir_out, 'index.js'),
            [],
            {
                cwd: path.join(__dirname, folder_dir_out),
            });

        forked.send(send);
        forked.on('error', (error) => {
            console.error(error)
            res.status(500).json(response_codes.code_500)
            return 0
        });
        forked.on('exit', (error) => {
            console.error(error)
            res.status(500).json(response_codes.code_500)
            return 0
        });
        forked.on('message', (message) => {

            if (message.error) {
                console.error(message.error)
                res.status(500).json(response_codes.code_500)
                return 0
            } else if (message.end) {
                let resp = response_codes.code_200
                resp.data = message.data
                res.status(200).json(resp)
                return 0
            } else if (!message.end) {

            }
        });


    } catch (e) {
        console.error(e)
        res.status(500).json(response_codes.code_500)
        return 0
    }
});

router.put('/exec/:app_id/:name', access_middleware, async function (req, res) {
    let {app_id, name} = req.params;
    let {body, query, params, headers} = req;
    let requirement = {body, query, params, headers};

    if (!name) {
        res.status(401).json(response_codes.code_401)
        return 0;
    }
    if (!app_id) {
        res.status(533).json(response_codes.code_533)
        return 0;
    }
    try {
        let my_app = await app.findById(app_id);
        if (!my_app) {
            res.status(533).json(response_codes.code_533)
            return 0;
        }
        if (!my_app.deployed) {
            res.status(534).json(response_codes.code_534)
            return 0;
        }
        let my_function_ = await cloud_functions.findOne({
            app: app_id,
            name: name,
            //method: 'GET',
            // active: true
        });

        if (!my_function_) {
            res.status(404).json(response_codes.code_404)
            return 0
        }

        if (!my_function_.active) {
            res.status(437).json(response_codes.code_537)
            return 0
        }
        if (my_function_.method !== 'PUT') {
            res.status(405).json(response_codes.code_405)
            return 0
        }


        // action
        let send = {
            kind: 'FUNCTION',
            method: 'PUT',
            req: requirement,
            app_id: app_id,
            function_name: name,
            who: req.who
        }

        let folder_dir_out = '../../cloud/app_' + my_app._id + '/';

        const forked = fork(path.join(__dirname, folder_dir_out, 'index.js'),
            [],
            {
                cwd: path.join(__dirname, folder_dir_out),
            });

        forked.send(send);
        forked.on('error', (error) => {
            console.error(error)
            res.status(500).json(response_codes.code_500)
            return 0
        });
        forked.on('exit', (error) => {
            console.error(error)
            res.status(500).json(response_codes.code_500)
            return 0
        });
        forked.on('message', (message) => {

            if (message.error) {
                console.error(message.error)
                res.status(500).json(response_codes.code_500)
                return 0
            } else if (message.end) {
                let resp = response_codes.code_200
                resp.data = message.data
                res.status(200).json(resp)
                return 0
            } else if (!message.end) {

            }
        });


    } catch (e) {
        console.error(e)
        res.status(500).json(response_codes.code_500)
        return 0
    }
});

router.delete('/exec/:app_id/:name', access_middleware, async function (req, res) {
    let {app_id, name} = req.params;
    let {body, query, params, headers} = req;
    let requirement = {body, query, params, headers};

    if (!name) {
        res.status(401).json(response_codes.code_401)
        return 0;
    }
    if (!app_id) {
        res.status(533).json(response_codes.code_533)
        return 0;
    }
    try {
        let my_app = await app.findById(app_id);
        if (!my_app) {
            res.status(533).json(response_codes.code_533)
            return 0;
        }
        if (!my_app.deployed) {
            res.status(534).json(response_codes.code_534)
            return 0;
        }
        let my_function_ = await cloud_functions.findOne({
            app: app_id,
            name: name,
            //method: 'GET',
            // active: true
        });

        if (!my_function_) {
            res.status(404).json(response_codes.code_404)
            return 0
        }

        if (!my_function_.active) {
            res.status(437).json(response_codes.code_537)
            return 0
        }
        if (my_function_.method !== 'DELETE') {
            res.status(405).json(response_codes.code_405)
            return 0
        }


        // action
        let send = {
            kind: 'FUNCTION',
            method: 'DELETE',
            req: requirement,
            app_id: app_id,
            function_name: name,
            who: req.who
        }

        let folder_dir_out = '../../cloud/app_' + my_app._id + '/';

        const forked = fork(path.join(__dirname, folder_dir_out, 'index.js'),
            [],
            {
                cwd: path.join(__dirname, folder_dir_out),
            });

        forked.send(send);
        forked.on('error', (error) => {
            console.error(error)
            res.status(500).json(response_codes.code_500)
            return 0
        });
        forked.on('exit', (error) => {
            console.error(error)
            res.status(500).json(response_codes.code_500)
            return 0
        });
        forked.on('message', (message) => {

            if (message.error) {
                console.error(message.error)
                res.status(500).json(response_codes.code_500)
                return 0
            } else if (message.end) {
                let resp = response_codes.code_200
                resp.data = message.data
                res.status(200).json(resp)
                return 0
            } else if (!message.end) {

            }
        });


    } catch (e) {
        console.error(e)
        res.status(500).json(response_codes.code_500)
        return 0
    }
});


module.exports = router;
