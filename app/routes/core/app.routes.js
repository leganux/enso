const express = require('express');
const router = express.Router();
const api_crud = require('../../helpers/api_crud_constructor.helper');
const response_codes = require('../../helpers/response_codes.helper').codes;
const app = require('./../../models/core/app.m.js');
const user_roles = require('./../../models/user_roles.m');
const user_routes = require('./../../models/routes_user.m');
const user_permission = require('./../../models/user_permission_by_rol.m');
const admin = require('./../../models/core/app.m.js');
const access_middleware = require('./../../auth/auth.middleware').auth
var copydir = require('copy-dir');
var path = require('path');
const fs = require('fs');
const {execSync, spawnSync} = require('child_process');

var add_user_default_path_and_permission = function (role_id, app_id) {
    let routes_admin_list = [
        {
            url: 'dashboard',
            description: 'Dashboard panel',
            type: 'admin_panel',
            active: true
        },
        {
            url: 'catalogue/places',
            description: 'Catalogue of places',
            type: 'admin_panel',
            active: true
        }, {
            url: 'catalogue/languages',
            description: 'Catalogue of languages',
            type: 'admin_panel',
            active: true
        }, {
            url: 'catalogue/dynamic_content',
            description: 'Catalogue of dynamic content',
            type: 'admin_panel',
            active: true
        }, {
            url: 'cdn',
            description: 'Catalogue of places',
            type: 'admin_panel',
            active: true
        }, {
            url: 'cdn',
            description: 'Catalogue of places',
            type: 'admin_panel',
            active: true
        },
        {
            url: 'app/:name/config',
            description: 'App configuration',
            type: 'admin_panel',
            active: true
        }, {
            url: 'app/:name/user_roles',
            description: 'Roles of users',
            type: 'admin_panel',
            active: true
        }, {
            url: 'app/:name/user_permission',
            description: 'Permission user by role',
            type: 'admin_panel',
            active: true
        }, {
            url: 'app/:name/dynamic_db',
            description: 'Dynamic Database',
            type: 'admin_panel',
            active: true
        }, {
            url: 'app/:name/cloud_functions',
            description: 'Rest functions',
            type: 'admin_panel',
            active: true
        }, {
            url: 'app/:name/files',
            description: 'File Admin',
            type: 'admin_panel',
            active: true
        }, {
            url: 'app/:name/cron',
            description: 'Cron functions panel',
            type: 'admin_panel',
            active: true
        }, {
            url: 'app/:name/mailing',
            description: 'Mailing panel',
            type: 'admin_panel',
            active: true
        }, {
            url: 'app/:name/sms_gateway',
            description: 'Gateway to send SMS ',
            type: 'admin_panel',
            active: true
        }, {
            url: 'app/:name/webservices',
            description: 'Webservices panel config',
            type: 'admin_panel',
            active: true
        }, {
            url: 'app/:name/users',
            description: 'Users panel',
            type: 'admin_panel',
            active: true
        }, {
            url: 'app/api/user_roles/:app_id',
            description: 'roles of users ',
            type: 'api',
            active: true,
            methods: 'POST,GET,PUT,DELETE'
        }, {
            url: 'app/api/user/:app_id',
            description: 'user in this app',
            type: 'api',
            active: true,
            methods: 'POST,GET,PUT,DELETE'
        },
        {
            url: 'app/api/routes/:app_id',
            description: 'routes for users',
            type: 'api',
            active: true,
            methods: 'POST,GET,PUT,DELETE'
        }, {
            url: 'app/api/permission/role/:app_id',
            description: 'Permission by roles',
            type: 'api',
            active: true,
            methods: 'POST,GET,PUT,DELETE'
        }, {
            url: 'api/core/app/deploy/:app_id',
            description: 'Deploying this app',
            type: 'api',
            active: true,
            methods: 'POST,GET,PUT,DELETE'
        }, {
            url: 'api/core/app/',
            description: 'Save changes in  app',
            type: 'api',
            active: true,
            methods: 'POST,GET,PUT,DELETE'
        },
        {
            url: 'api/places/country',
            description: 'Places catalogue country',
            type: 'api',
            active: true,
            methods: 'POST,GET,PUT,DELETE'
        }, {
            url: 'api/places/state',
            description: 'Places catalogue state',
            type: 'api',
            active: true,
            methods: 'POST,GET,PUT,DELETE'
        }, {
            url: 'api/places/city',
            description: 'Places catalogue city',
            type: 'api',
            active: true,
            methods: 'POST,GET,PUT,DELETE'
        }, {
            url: 'api/core/cdn',
            description: 'cdn',
            type: 'api',
            active: true,
            methods: 'POST,GET,PUT,DELETE'
        }, {
            url: 'api/core/cdn/scan_folder',
            description: 'CDN Scan Folder',
            type: 'api',
            active: true,
            methods: 'POST'
        }, {
            url: 'api/core/cdn/zip_uploader',
            description: 'CDN upload ZIP',
            type: 'api',
            active: true,
            methods: 'POST'
        }, {
            url: 'api/i18n/dynamic_content',
            description: ' catalogue dynamic content',
            type: 'api',
            active: true,
            methods: 'POST,GET,PUT,DELETE'
        }, {
            url: 'api/i18n/language_list',
            description: 'List of languages for system',
            type: 'api',
            active: true,
            methods: 'POST,GET,PUT,DELETE'
        }, {
            url: 'api/i18n/language_elements',
            description: 'Elements of every languge',
            type: 'api',
            active: true,
            methods: 'POST,GET,PUT,DELETE'
        },
        {
            url: 'app/api/db/collection/:app_id',
            description: 'DB collection definition',
            type: 'api',
            active: true,
            methods: 'POST,GET,PUT,DELETE'
        },{
            url: 'app/api/db/structure/:app_id',
            description: 'Structure definition',
            type: 'api',
            active: true,
            methods: 'POST,GET,PUT,DELETE'
        },
    ];
    routes_admin_list.map(async function (item, i) {

        let rExist = await user_routes.findOne({
            app: app_id,
            type: item.type,
            url: item.url
        });

        if (!rExist) {
            item.app = app_id;
            rExist = new user_routes(item);
            rExist = await rExist.save()
        }

        let perm = await user_permission.findOne({
            app: app_id,
            role: role_id,
            route: rExist._id
        });

        if (!perm) {
            perm = new user_permission({
                role: role_id,
                route: rExist._id,
                app: app_id
            })
            if (item.type == 'admin_panel') {
                perm.see = true;
            } else {
                perm.create = true;
                perm.read_me = false;
                perm.read_all = true;
                perm.update_me = false;
                perm.update_all = true;
                perm.delete_me = false;
                perm.delete_all = true;
            }
            perm = await perm.save()

        }

    });
    return 1;
}

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

        if (my_app.owner == req.user.user && req.user.kind == 'admin') {

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


        if (!my_app.default_role || my_app.default_role == '') {
            let df_role = new user_roles({
                name: 'Unregistered',
                description: 'The default role for users that are not registered or logged ',
                active: true,
                app: my_app._id,
            });
            let role = await df_role.save()
            my_app.default_role = role._id;

        }
        if (!my_app.default_role_new || my_app.default_role_new == '') {


            let df_role = new user_roles({
                name: 'New user role  by default',
                description: 'The default role for users that are register by themselves ',
                active: true,
                app: my_app._id,
            });
            let role = await df_role.save()
            my_app.default_role_new = role._id;
            add_user_default_path_and_permission(role._id, app_id)
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
            default_role: my_app.default_role,
            default_role_new: my_app.default_role_new,
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
