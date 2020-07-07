const express = require('express');
const router = express.Router();
const api_crud = require('../../helpers/api_crud_constructor.helper');
const response_codes = require('../../helpers/response_codes.helper').codes;
const app = require('./../../models/core/app.m.js');
const admin = require('./../../models/core/app.m.js');
const access_middleware = require('./../../auth/auth.middleware').auth
var copydir = require('copy-dir');
var path = require('path');
const fs = require('fs');
const {execSync, spawnSync} = require('child_process');

api_crud.all(router, app, access_middleware, [{path: 'owner', model: 'admin'}], 'name,description,token');

router.post('/deploy/:id', access_middleware, async (req, res) => {
    if (!req.params || !req.params.id) {
        res.status(533).json(response_codes.code_533)
        return 0;
    }

    try {
        let app_id = req.params.id;
        let my_app = await app.findById(app_id);

        if (!my_app) {
            res.status(404).json(response_codes.code_404)
            return 0;
        }

        if (my_app.owner != req.user.user && req.user.kind == 'admin') {
            console.log('HERE')
            res.status(403).json(response_codes.code_403)
            return 0;
        }

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

        var variables_json = {
            mongo_host: my_app.db_host,
            mongo_port: my_app.db_port,
            mongo_user: my_app.db_user,
            mongo_password: my_app.db_password,
            mongo_database: my_app.db_name,
            admin_owner_id: my_app.owner,
            app_id: my_app._id,
            app_token: my_app.token,
            mail_user: my_app.mail_user,
            mail_password: my_app.mail_password,
            mail_service: my_app.mail_service,
            mail_host: my_app.mail_host,
            mail_port: my_app.mail_port,
        }

        variables_json = JSON.stringify(variables_json)
        variables_json = 'module.exports = ' + variables_json

        fs.writeFileSync(path.join(__dirname, folder_dir_out, 'variables.js'), variables_json);

        console.log('Installing changes ... ', child.output);


        res.status(200).json(response)
    } catch (e) {
        console.error(e);
        res.status(500).json(response_codes.code_500);
        return 0;
    }


});


module.exports = router;
