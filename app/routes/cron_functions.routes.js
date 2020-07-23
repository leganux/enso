const express = require('express');
const router = express.Router();
const api_crud = require('../helpers/api_crud_constructor_app.helper');
const cron_functions = require('../models/cron_functions.m');
const access_middleware = require('./../auth/auth.middleware').auth
const app = require('./../models/core/app.m')
var path = require('path');
const fs = require('fs');
const {fork} = require('child_process');
const response_codes = require('./../helpers/response_codes.helper').codes;

var cron = require('node-cron');
var cb = require('cron-builder');
let RunningCron = {};
let moment = require('moment')

api_crud.all(router, cron_functions, access_middleware, false, 'name');

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

        let functions = await cron_functions.find({app: app_id})
            .exec();

        if (!functions) {
            res.status(404).json(response_codes.code_404)
            return 0;
        }


        for (var key in RunningCron) {
            try {
                RunningCron[key].stop();
                RunningCron[key].destroy();
            } catch (e) {
                console.info('Don`t Stop or destroy ', key)
            }

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
         
        var cron_function = {};
        `;
        for (var i = 0; i < functions.length; i++) {
            let item = functions[i];
            construccion = construccion + ' cron_function["' + item.name + '"]  = ' + item.content;
        }
        construccion = construccion + ' \n  module.exports =cron_function; '
        fs.writeFileSync(path.join(__dirname, folder_dir_out, 'cron.js'), construccion);

        for (var i = 0; i < functions.length; i++) {
            let item = functions[i];
            RunningCron[item.name] = cron.schedule(item.cron_string, () => {
                console.log('Calling CRON ', item.name)
                // action
                let send = {
                    kind: 'CRON',
                    app_id: app_id,
                    function_name: item.name,
                    who: req.who
                }
                let folder_dir_out = '../../cloud/app_' + my_app._id + '/';
                const forked = fork(path.join(__dirname, folder_dir_out, 'index.js'),
                    [],
                    {
                        cwd: path.join(__dirname, folder_dir_out),
                    });
                forked.send(send);

                console.log('Calling END ', item.name)
            }, {scheduled: false});

            if (item.active) {
                RunningCron[item.name].start()
            } else {
                RunningCron[item.name].stop()
            }


        }


        res.status(200).json(response_codes.code_200)

    } catch (e) {
        console.error(e)
        res.status(500).json(response_codes.code_500)
        return 0
    }

});

router.post('/make_cron_string/:app_id', async function (req, res) {
    let {body} = req;
    let response = response_codes.code_200;

    let cronExp = new cb();

    if (body.minute && body.minute.trim() != '' && body.minute != '*') {
        cronExp.addValue('minute', body.minute);
    }
    if (body.hour && body.hour.trim() != '' && body.hour != '*') {
        cronExp.addValue('hour', body.hour);
    }
    if (body.day_of_mont && body.day_of_mont.trim() != '' && body.day_of_mont != '*') {
        cronExp.addValue('dayOfTheMonth', body.day_of_mont);
    }
    if (body.day_of_week && body.day_of_week.trim() != '' && body.day_of_week != '*') {
        cronExp.addValue('dayOfTheWeek', body.day_of_week);
    }
    if (body.month_of_year && body.month_of_year.trim() != '' && body.month_of_year != '*') {
        cronExp.addValue('month', body.month_of_year);
    }

    response.data = cronExp.build();

    res.status(200).json(response);

});


module.exports = router;
