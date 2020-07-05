const express = require('express');
const router = express.Router();
const api_crud = require('../../helpers/api_crud_constructor.helper');
const response_codes = require('../../helpers/response_codes.helper').codes;
const app = require('./../../models/core/app.m.js');
const admin = require('./../../models/core/app.m.js');
const access_middleware = require('./../../auth/auth.middleware').auth
var copydir = require('copy-dir');
var path = require('path');
const {execSync, spawnSync} = require('child_process');

api_crud.all(router, app, access_middleware, [{path: 'owner', model: 'admin'}], 'name,description,token');

router.post('/deploy/', access_middleware, async (req, res) => {
    if (!req.cookies || !req.cookies._APP_) {
        res.status(533).json(response_codes.code_533)
        return 0;
    }

    try {
        let app_id = req.cookies._APP_;
        let my_app = await app.findById(app_id);
        let response = response_codes.code_200;
        let folder_dir_out = '../../../cloud/app_' + my_app._id + '/';
        let folder_dir_in = '../../../cloud/base';
        copydir.sync(path.join(__dirname, folder_dir_in), path.join(__dirname, folder_dir_out));


        const child = spawnSync('npm', ['install'], {
            stdio: 'pipe',
            encoding: 'utf-8',
            cwd: path.join(__dirname, folder_dir_out)
        });

        if (child.error) {
            console.error(child.error);
            res.status(500).json(response_codes.code_500);
            return 0;
        }

        my_app.deployed = true;
        await my_app.save();

        console.log('Installing changes ... ', child.output);


        res.status(200).json(response)
    } catch (e) {
        console.error(e);
        res.status(500).json(response_codes.code_500);
        return 0;
    }


});


module.exports = router;
