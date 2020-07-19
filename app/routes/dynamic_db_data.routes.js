const express = require('express');
const router = express.Router();

const response_codes = require('./../helpers/response_codes.helper').codes;
const env = require('./../config/environment.config').environment;
const fields = require('./../models/dynamic_db_structure.m');
const collection = require('./../models/dynamic_db_collection.m');
const app = require('./../models/core/app.m');
const access_middleware = require('./../auth/auth.middleware').auth
const moment = require('moment');

var path = require('path');
const fs = require('fs');
const {fork} = require('child_process');


router.post('/:app_id/:name', access_middleware, async (req, res) => {
    let {app_id, name} = req.params;
    let body = req.body;

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
        let my_db = await collection.findOne({app: app_id, name: name, active: true})
            .populate({path: 'fields', model: fields}).exec();
        if (!my_db) {
            res.status(536).json(response_codes.code_536)
            return 0;
        }

        let mandatory = [];
        my_db.fields.map(function (item, i) {
            if (item.mandatory) {
                if (!body[item.name] || body[item.name] == '') {
                    mandatory.push(item.name)
                }
            }

            if (body[item.name] || body[item.name] !== '') {
                switch (item.kind) {
                    case'date':
                        body[item.name] = moment(body[item.name]).format()
                        break;
                    case'number':
                        body[item.name] = Number(body[item.name]);
                        break;
                    case'oid_array':
                        body[item.name] = body[item.name].split(',');
                        break;
                    case'string':
                        body[item.name] = String(body[item.name]);
                        break;
                    case'boolean':
                        body[item.name] = eval(body[item.name]);
                        break;
                }
            }

        });

        if (mandatory.length > 1) {
            let resp = response_codes.code_435;
            resp.data = mandatory
            res.status(435).json(resp)
            return 0
        }


        // action
        let send = {
            kind: 'DB',
            method: 'POST',
            data: body,
            app_id: app_id,
            db_name: name,
            who:req.who
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
            console.log('MESSGE from CHILD', message)
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

router.post('/:app_id/:name/updateOrCreate', access_middleware, async (req, res) => {
    let {app_id, name} = req.params;
    let body = req.body.data;
    let where = req.body.where;

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
        let my_db = await collection.findOne({app: app_id, name: name, active: true})
            .populate({path: 'fields', model: fields}).exec();
        if (!my_db) {
            res.status(536).json(response_codes.code_536)
            return 0;
        }

        let mandatory = [];
        my_db.fields.map(function (item, i) {
            if (item.mandatory) {
                if (!body[item.name] || body[item.name] == '') {
                    mandatory.push(item.name)
                }
            }

            if (body[item.name] || body[item.name] !== '') {
                switch (item.kind) {
                    case'date':
                        body[item.name] = moment(body[item.name]).format()
                        break;
                    case'number':
                        body[item.name] = Number(body[item.name]);
                        break;
                    case'oid_array':
                        body[item.name] = body[item.name].split(',');
                        break;
                    case'string':
                        body[item.name] = String(body[item.name]);
                        break;
                    case'boolean':
                        body[item.name] = eval(body[item.name]);
                        break;
                }
            }

        });

        if (mandatory.length > 1) {
            let resp = response_codes.code_435;
            resp.data = mandatory
            res.status(435).json(resp)
            return 0
        }


        // action
        let send = {
            kind: 'DB',
            method: 'updateOrCreate',
            data: {body, where},
            app_id: app_id,
            db_name: name,  who:req.who
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
            console.log('MESSGE from CHILD', message)
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

router.put('/:app_id/:name/:id', access_middleware, async (req, res) => {
    let {app_id, name, id} = req.params;
    let body = req.body;

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
        let my_db = await collection.findOne({app: app_id, name: name, active: true})
            .populate({path: 'fields', model: fields}).exec();
        if (!my_db) {
            res.status(536).json(response_codes.code_536)
            return 0;
        }

        let mandatory = [];
        my_db.fields.map(function (item, i) {
            if (item.mandatory) {
                if (!body[item.name] || body[item.name] == '') {
                    mandatory.push(item.name)
                }
            }

            if (body[item.name] || body[item.name] !== '') {
                switch (item.kind) {
                    case'date':
                        body[item.name] = moment(body[item.name]).format()
                        break;
                    case'number':
                        body[item.name] = Number(body[item.name]);
                        break;
                    case'oid_array':
                        body[item.name] = body[item.name].split(',');
                        break;
                    case'string':
                        body[item.name] = String(body[item.name]);
                        break;
                    case'boolean':
                        body[item.name] = eval(body[item.name]);
                        break;
                }
            }

        });

        if (mandatory.length > 1) {
            let resp = response_codes.code_435;
            resp.data = mandatory
            res.status(435).json(resp)
            return 0
        }


        // action
        let send = {
            kind: 'DB',
            method: 'PUT',
            data: body,
            app_id: app_id,
            db_name: name,
            id: id,  who:req.who
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
            console.log('MESSGE from CHILD', message)
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

router.put('/:app_id/:name/', access_middleware, async (req, res) => {
    let {app_id, name} = req.params;
    let {where, body, and, or, select, paginate, sort} = req.body;


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
        let my_db = await collection.findOne({app: app_id, name: name, active: true})
            .populate({path: 'fields', model: fields}).exec();
        if (!my_db) {
            res.status(536).json(response_codes.code_536)
            return 0;
        }

        let mandatory = [];
        my_db.fields.map(function (item, i) {
            if (item.mandatory) {
                if (!body[item.name] || body[item.name] == '') {
                    mandatory.push(item.name)
                }
            }

            if (body[item.name] || body[item.name] !== '') {
                switch (item.kind) {
                    case'date':
                        body[item.name] = moment(body[item.name]).format()
                        break;
                    case'number':
                        body[item.name] = Number(body[item.name]);
                        break;
                    case'oid_array':
                        body[item.name] = body[item.name].split(',');
                        break;
                    case'string':
                        body[item.name] = String(body[item.name]);
                        break;
                    case'boolean':
                        body[item.name] = eval(body[item.name]);
                        break;
                }
            }

        });

        if (mandatory.length > 1) {
            let resp = response_codes.code_435;
            resp.data = mandatory
            res.status(435).json(resp)
            return 0
        }


        // action
        let send = {
            kind: 'DB',
            method: 'PUT_where',
            data: {where, body, and, or, select, paginate, sort},
            app_id: app_id,
            db_name: name,  who:req.who
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
            console.log('MESSGE from CHILD', message)
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

router.get('/:app_id/:name/', access_middleware, async (req, res) => {
    let {app_id, name} = req.params;

    let where = req.query.where;
    let or = req.query.or;
    let and = req.query.and;
    let select = req.query.select;
    let paginate = req.query.paginate;
    let sort = req.query.sort;

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
        let my_db = await collection.findOne({app: app_id, name: name, active: true})
            .populate({path: 'fields', model: fields}).exec();
        if (!my_db) {
            res.status(536).json(response_codes.code_536)
            return 0;
        }


        // action
        let send = {
            kind: 'DB',
            method: 'GET_ALL',
            data: {where, or, and, select, paginate, sort},
            app_id: app_id,
            db_name: name,
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
            console.log('MESSGE from CHILD', message)
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

router.get('/:app_id/:name/one', access_middleware, async (req, res) => {
    let {app_id, name} = req.params;

    let where = req.query.where;
    let or = req.query.or;
    let and = req.query.and;
    let select = req.query.select;
    let paginate = req.query.paginate;
    let sort = req.query.sort;

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
        let my_db = await collection.findOne({app: app_id, name: name, active: true})
            .populate({path: 'fields', model: fields}).exec();
        if (!my_db) {
            res.status(536).json(response_codes.code_536)
            return 0;
        }


        // action
        let send = {
            kind: 'DB',
            method: 'GET_ONE',
            data: {where, or, and, select, paginate, sort},
            app_id: app_id,
            db_name: name,  who:req.who
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
            console.log('MESSGE from CHILD', message)
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

router.get('/:app_id/:name/:id', access_middleware, async (req, res) => {
    let {app_id, name, id} = req.params;


    let select = req.query.select;
    let paginate = req.query.paginate;
    let sort = req.query.sort;


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
        let my_db = await collection.findOne({app: app_id, name: name, active: true})
            .populate({path: 'fields', model: fields}).exec();
        if (!my_db) {
            res.status(536).json(response_codes.code_536)
            return 0;
        }


        // action
        let send = {
            kind: 'DB',
            method: 'GET_ID',
            id: id,
            data: {select, paginate, sort},
            app_id: app_id,
            db_name: name,  who:req.who
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
            console.log('MESSGE from CHILD', message)
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

router.delete('/:app_id/:name/:id', access_middleware, async (req, res) => {
    let {app_id, name, id} = req.params;

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
        let my_db = await collection.findOne({app: app_id, name: name, active: true})
            .populate({path: 'fields', model: fields}).exec();
        if (!my_db) {
            res.status(536).json(response_codes.code_536)
            return 0;
        }


        // action
        let send = {
            kind: 'DB',
            method: 'DELETE',
            id: id,
            app_id: app_id,
            db_name: name,  who:req.who
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
            console.log('MESSGE from CHILD', message)
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

router.post('/:app_id/:name/datatable', access_middleware, async (req, res) => {
    let {app_id, name, id} = req.params;
    let search_fields = req.body;

    if (!search_fields) {
        search_fields = []
    } else {
        if (typeof search_fields === 'string') {
            search_fields = search_fields.split(',')
        }
    }


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
        let my_db = await collection.findOne({app: app_id, name: name, active: true})
            .populate({path: 'fields', model: fields}).exec();
        if (!my_db) {
            res.status(536).json(response_codes.code_536)
            return 0;
        }


        // action
        let send = {
            kind: 'DB',
            method: 'DATATABLE',
            req: req,
            search_fields,
            app_id: app_id,
            db_name: name,  who:req.who
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
            console.log('MESSGE from CHILD', message)
            if (message.error) {
                console.error(message.error)
                res.status(500).json(response_codes.code_500)
                return 0
            } else if (message.end) {
                let resp = response_codes.code_200
                resp.data = message.data
                res.status(200).json(resp.data)
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
