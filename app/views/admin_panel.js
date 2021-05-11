/**
 * *
 * Here you find all config routes  to load  admin panel
 *
 * */

const express = require('express');
const router = express.Router();
const response_codes = require('../helpers/response_codes.helper').codes;
const env = require('../config/environment.config').environment;
const seo = require('../helpers/global_seo.helper').seo;
const param_converter = require('../helpers/param_converter.helper');
const resources = require('./../config/admin_panel_cdn_resources.config').admin_panel;
const site_files_path = env.root_path + 'content/files/site/';
const core_files_path = env.root_path + 'content/core/';
const api_path = env.root_path + 'api/core/';
const base_admin_path = env.root_path + env.control_panel_url;
const i18n_constructor = require('./../helpers/i18n_json_constructor.helper')
const access_middleware = require('./../auth/auth.middleware').auth
const app_model = require('./../models/core/app.m')
const admin_model = require('./../models/core/admin.m')
const user_model = require('./../models/users.m')

let get_app_id_from_user = async function (req, res) {
    let user_kind = req.user && req.user.kind ? req.user.kind : false;
    if (user_kind == 'admin') {
        return req.cookies && req.cookies._APP_ ? req.cookies._APP_ : false;
    } else {
        let user_id = req.user && req.user.user ? req.user.user : false;
        if (user_id) {
            var usr = await user_model.findById(user_id);
            res.cookie('_APP_', usr.app.toString(), {maxAge: 900000, httpOnly: false});
            return usr.app.toString();
        }
    }
    return false;
}

let get_app_basic_config = async function (req, res, params) {
    var config = {};
    var config_params = {};
    config.seo = seo;
    config.resources = resources.dashboard;
    config.root_path = env.root_path;
    config.Domain = env.Domain;
    config.img_folder = site_files_path + 'img/';
    config.base_admin_path = base_admin_path;
    config.core_files_path = core_files_path;

    config_params.root_path = env.root_path;
    config_params.Domain = env.Domain;
    config_params.site_files_path = site_files_path;
    config_params.img_folder = site_files_path + 'img/';
    config_params.base_admin_path = base_admin_path;
    config_params.core_files_path = core_files_path;

    //config varibales
    config.scr_access = req.access;
    config.i18n = await i18n_constructor.i18n_json(req);
    config._app_id_ = await get_app_id_from_user(req, res);
    config.user = req.user ? req.user.user : false;
    config.kind_of_user = req.user && req.user.kind ? req.user.kind : false;


    //Config variables JS front
    config_params.i18n = config.i18n;
    config_params.user = config.user;
    config_params.kind_of_user = config.kind_of_user;
    config_params._app_id_ = config._app_id_;

    if (params && typeof params == 'object') {
        for (let [key, value] of Object.entries(params)) {
            config[key] = value;
            config_params[key] = value;
        }
    }

    config.params = param_converter(config_params)
    return config;
}

let model_to_json = function (obj) {
    obj = JSON.stringify(obj)
    obj = JSON.parse(obj)
    return obj;
}


router.get('/', async function (req, res) {

    var i18n = await i18n_constructor.i18n_json(req);
    res.status(200).render('admin_panel/login', {
        seo: seo,
        resources: resources.login,
        root_path: env.root_path,
        Domain: env.Domain,
        img_folder: site_files_path + 'img/',
        base_admin_path,
        core_files_path,
        i18n,
        _app_id_: req.cookies && req.cookies._APP_ ? req.cookies._APP_ : false,

        params: param_converter({
            root_path: env.root_path,
            Domain: env.Domain,
            img_folder: site_files_path + 'img/',
            site_files_path,
            base_admin_path,
            core_files_path,
            i18n,
            user: req.user && req.user.user ? req.user.user : false,
            _app_id_: req.cookies && req.cookies._APP_ ? req.cookies._APP_ : false,

        })
    });
});

router.get('/dashboard/', access_middleware, async function (req, res) {
    let config = await get_app_basic_config(req, res)
    res.status(200).render('admin_panel/dashboard', config)
});

router.get('/admin_roles/', access_middleware, async function (req, res) {
    let config = await get_app_basic_config(req, res)
    res.status(200).render('admin_panel/admin_roles', config);
});

router.get('/admin/', access_middleware, async function (req, res) {
    let config = await get_app_basic_config(req, res)

    res.status(200).render('admin_panel/admin', config);
});

router.get('/catalogue/routes/', access_middleware, async function (req, res) {
    let config = await get_app_basic_config(req, res)

    res.status(200).render('admin_panel/catalogue_routes', config);
});

router.get('/catalogue/places/', access_middleware, async function (req, res) {
    let config = await get_app_basic_config(req, res)

    res.status(200).render('admin_panel/catalogue_places', config);
});

router.get('/catalogue/languages/', access_middleware, async function (req, res) {
    let config = await get_app_basic_config(req, res)

    res.status(200).render('admin_panel/catalogue_languages', config);
});

router.get('/catalogue/dynamic_content/', access_middleware, async function (req, res) {
    let config = await get_app_basic_config(req, res)
    res.status(200).render('admin_panel/dynamic_content', config);
});
router.get('/catalogue/chatbots_type/', access_middleware, async function (req, res) {
    let config = await get_app_basic_config(req, res)
    res.status(200).render('admin_panel/chatbot_type', config);
});
router.get('/admin_permission/', access_middleware, async function (req, res) {
    let config = await get_app_basic_config(req, res)
    res.status(200).render('admin_panel/admin_permission', config);
});

router.get('/cdn/', access_middleware, async function (req, res) {
    let config = await get_app_basic_config(req, res)
    res.status(200).render('admin_panel/cdn', config);
});

router.get('/console_log/', access_middleware, async function (req, res) {
    let config = await get_app_basic_config(req, res, {
        general_socket_path: env.root_path + env.socket_path,
    })

    res.status(200).render('admin_panel/console_log', config);
});

router.get('/apps/', access_middleware, async function (req, res) {
    let config = await get_app_basic_config(req, res)

    console.info(req.user)
    res.status(200).render('admin_panel/apps', config);
});

router.get('/g_file_manager/', access_middleware, async function (req, res) {
    let config = await get_app_basic_config(req, res);
    res.status(200).render('admin_panel/g_file_manager', config);
});

router.get('/app/:id/config', access_middleware, async function (req, res) {

    var id = req.params.id;

    try {
        let app = await app_model.findById(id).populate({path: "owner", model: admin_model});
        if (!app) {
            res.status(404).json(response_codes.code_404)
            return 0;
        }
        if (req.user.kind === 'admin' && app.owner._id != req.user.user) {
            res.status(403).json(response_codes.code_403)
            return 0;
        }

        let config = await get_app_basic_config(req, res, {
            mail_service: app.mail_service,
            app: model_to_json(app)
        })
        res.status(200).render('admin_panel/app_config', config);

    } catch (e) {
        let err = response_codes.code_500;
        err.error = e;
        res.status(500).json(err);
        return 0;
    }


});

router.get('/app/:id/user_roles', access_middleware, async function (req, res) {
    var id = req.params.id;

    if (req.cookies._APP_ !== id) {
        res.status(533).json(response_codes.code_533)
        return 0;
    }

    try {
        let app = await app_model.findById(id).populate({path: "owner", model: admin_model});

        if (!app) {
            res.status(533).json(response_codes.code_533)
            return 0;
        }
        if (!app.deployed) {
            res.status(534).json(response_codes.code_534)
            return 0;
        }
        if (!app.active) {
            res.status(535).json(response_codes.code_535)
            return 0;
        }

        let config = await get_app_basic_config(req, res, {
            mail_service: app.mail_service,
            app: model_to_json(app)
        })
        res.status(200).render('admin_panel/app_user_roles', config);

    } catch (e) {
        let err = response_codes.code_500;
        err.error = e;
        res.status(500).json(err);
        return 0;
    }


});

router.get('/app/:id/users', access_middleware, async function (req, res) {

    var id = req.params.id;

    if (!req.cookies || !req.cookies._APP_ || req.cookies._APP_ === 'false') {
        res.redirect(base_admin_path + 'apps')
        return 0;
    }
    if (req.cookies._APP_ !== id) {
        res.status(533).json(response_codes.code_533)
        return 0;
    }

    try {
        let app = await app_model.findById(id).populate({path: "owner", model: admin_model});

        if (!app) {
            res.status(533).json(response_codes.code_533)
            return 0;
        }
        if (!app.deployed) {
            res.status(534).json(response_codes.code_534)
            return 0;
        }
        if (!app.active) {
            res.status(535).json(response_codes.code_535)
            return 0;
        }

        let config = await get_app_basic_config(req, res, {
            mail_service: app.mail_service,
            app: model_to_json(app)
        })
        res.status(200).render('admin_panel/app_users', config);


    } catch (e) {
        let err = response_codes.code_500;
        err.error = e;
        res.status(500).json(err);
        return 0;
    }


});


router.get('/app/:id/user_permission', access_middleware, async function (req, res) {


    var id = req.params.id;

    if (!req.cookies || !req.cookies._APP_ || req.cookies._APP_ === 'false') {
        res.redirect(base_admin_path + 'apps')
        return 0;
    }
    if (req.cookies._APP_ !== id) {
        res.status(533).json(response_codes.code_533)
        return 0;
    }

    try {
        let app = await app_model.findById(id).populate({path: "owner", model: admin_model});

        if (!app) {
            res.status(533).json(response_codes.code_533)
            return 0;
        }
        if (!app.deployed) {
            res.status(534).json(response_codes.code_534)
            return 0;
        }
        if (!app.active) {
            res.status(535).json(response_codes.code_535)
            return 0;
        }

        let config = await get_app_basic_config(req, res, {
            mail_service: app.mail_service,
            app: model_to_json(app)
        })
        res.status(200).render('admin_panel/user_permission', config);


    } catch (e) {
        let err = response_codes.code_500;
        err.error = e;
        res.status(500).json(err);
        return 0;
    }


});

router.get('/app/:id/dynamic_db', access_middleware, async function (req, res) {
    var id = req.params.id;
    if (!req.cookies || !req.cookies._APP_ || req.cookies._APP_ === 'false') {
        res.redirect(base_admin_path + 'apps')
        return 0;
    }
    if (req.cookies._APP_ !== id) {
        res.status(533).json(response_codes.code_533)
        return 0;
    }

    try {
        let app = await app_model.findById(id).populate({path: "owner", model: admin_model});

        if (!app) {
            res.status(533).json(response_codes.code_533)
            return 0;
        }
        if (!app.deployed) {
            res.status(534).json(response_codes.code_534)
            return 0;
        }
        if (!app.active) {
            res.status(535).json(response_codes.code_535)
            return 0;
        }

        let config = await get_app_basic_config(req, res, {
            app: model_to_json(app)
        })
        res.status(200).render('admin_panel/dynamic_db', config);
    } catch (e) {
        let err = response_codes.code_500;
        err.error = e;
        res.status(500).json(err);
        return 0;
    }


});

router.get('/app/:id/cloud_functions', access_middleware, async function (req, res) {
    var id = req.params.id;
    if (!req.cookies || !req.cookies._APP_ || req.cookies._APP_ === 'false') {
        res.redirect(base_admin_path + 'apps')
        return 0;
    }
    if (req.cookies._APP_ !== id) {
        res.status(533).json(response_codes.code_533)
        return 0;
    }
    try {
        let app = await app_model.findById(id).populate({path: "owner", model: admin_model});

        if (!app) {
            res.status(533).json(response_codes.code_533)
            return 0;
        }
        if (!app.deployed) {
            res.status(534).json(response_codes.code_534)
            return 0;
        }
        if (!app.active) {
            res.status(535).json(response_codes.code_535)
            return 0;
        }
        let config = await get_app_basic_config(req, res, {
            app: model_to_json(app)
        })
        res.status(200).render('admin_panel/cloud_functions', config);
    } catch (e) {
        let err = response_codes.code_500;
        err.error = e;
        res.status(500).json(err);
        return 0;
    }


});
router.get('/app/:id/files', access_middleware, async function (req, res) {
    var id = req.params.id;
    if (!req.cookies || !req.cookies._APP_ || req.cookies._APP_ === 'false') {
        res.redirect(base_admin_path + 'apps')
        return 0;
    }
    if (req.cookies._APP_ !== id) {
        res.status(533).json(response_codes.code_533)
        return 0;
    }

    try {
        let app = await app_model.findById(id).populate({path: "owner", model: admin_model});

        if (!app) {
            res.status(533).json(response_codes.code_533)
            return 0;
        }
        if (!app.deployed) {
            res.status(534).json(response_codes.code_534)
            return 0;
        }
        if (!app.active) {
            res.status(535).json(response_codes.code_535)
            return 0;
        }

        let config = await get_app_basic_config(req, res, {
            app: model_to_json(app)
        })
        res.status(200).render('admin_panel/files', config);
    } catch (e) {
        let err = response_codes.code_500;
        err.error = e;
        res.status(500).json(err);
        return 0;
    }


});
router.get('/app/:id/cron', access_middleware, async function (req, res) {
    var id = req.params.id;
    if (!req.cookies || !req.cookies._APP_ || req.cookies._APP_ === 'false') {
        res.redirect(base_admin_path + 'apps')
        return 0;
    }
    if (req.cookies._APP_ !== id) {
        res.status(533).json(response_codes.code_533)
        return 0;
    }

    try {
        let app = await app_model.findById(id).populate({path: "owner", model: admin_model});

        if (!app) {
            res.status(533).json(response_codes.code_533)
            return 0;
        }
        if (!app.deployed) {
            res.status(534).json(response_codes.code_534)
            return 0;
        }
        if (!app.active) {
            res.status(535).json(response_codes.code_535)
            return 0;
        }

        let config = await get_app_basic_config(req, res, {
            app: model_to_json(app)
        })
        res.status(200).render('admin_panel/cron', config);
    } catch (e) {
        let err = response_codes.code_500;
        err.error = e;
        res.status(500).json(err);
        return 0;
    }


});
router.get('/app/:id/contacts', access_middleware, async function (req, res) {
    var id = req.params.id;
    if (!req.cookies || !req.cookies._APP_ || req.cookies._APP_ === 'false') {
        res.redirect(base_admin_path + 'apps')
        return 0;
    }
    if (req.cookies._APP_ !== id) {
        res.status(533).json(response_codes.code_533)
        return 0;
    }

    try {
        let app = await app_model.findById(id).populate({path: "owner", model: admin_model});

        if (!app) {
            res.status(533).json(response_codes.code_533)
            return 0;
        }
        if (!app.deployed) {
            res.status(534).json(response_codes.code_534)
            return 0;
        }
        if (!app.active) {
            res.status(535).json(response_codes.code_535)
            return 0;
        }

        let config = await get_app_basic_config(req, res, {
            app: model_to_json(app)
        })
        res.status(200).render('admin_panel/contacts', config);
    } catch (e) {
        let err = response_codes.code_500;
        err.error = e;
        res.status(500).json(err);
        return 0;
    }


});
router.get('/app/:id/mailing', access_middleware, async function (req, res) {
    var id = req.params.id;
    if (!req.cookies || !req.cookies._APP_ || req.cookies._APP_ === 'false') {
        res.redirect(base_admin_path + 'apps')
        return 0;
    }
    if (req.cookies._APP_ !== id) {
        res.status(533).json(response_codes.code_533)
        return 0;
    }

    try {
        let app = await app_model.findById(id).populate({path: "owner", model: admin_model});

        if (!app) {
            res.status(533).json(response_codes.code_533)
            return 0;
        }
        if (!app.deployed) {
            res.status(534).json(response_codes.code_534)
            return 0;
        }
        if (!app.active) {
            res.status(535).json(response_codes.code_535)
            return 0;
        }

        let config = await get_app_basic_config(req, res, {
            app: model_to_json(app)
        })
        res.status(200).render('admin_panel/mailing', config);
    } catch (e) {
        let err = response_codes.code_500;
        err.error = e;
        res.status(500).json(err);
        return 0;
    }


});
router.get('/app/:id/sms_gateway', access_middleware, async function (req, res) {
    var id = req.params.id;
    if (!req.cookies || !req.cookies._APP_ || req.cookies._APP_ === 'false') {
        res.redirect(base_admin_path + 'apps')
        return 0;
    }
    if (req.cookies._APP_ !== id) {
        res.status(533).json(response_codes.code_533)
        return 0;
    }

    try {
        let app = await app_model.findById(id).populate({path: "owner", model: admin_model});

        if (!app) {
            res.status(533).json(response_codes.code_533)
            return 0;
        }
        if (!app.deployed) {
            res.status(534).json(response_codes.code_534)
            return 0;
        }
        if (!app.active) {
            res.status(535).json(response_codes.code_535)
            return 0;
        }

        let config = await get_app_basic_config(req, res, {
            app: model_to_json(app)
        })

        res.status(200).render('admin_panel/sms_gateway', config);
    } catch (e) {
        let err = response_codes.code_500;
        err.error = e;
        res.status(500).json(err);
        return 0;
    }


});
router.get('/app/:id/webservices', access_middleware, async function (req, res) {
    var id = req.params.id;
    if (!req.cookies || !req.cookies._APP_ || req.cookies._APP_ === 'false') {
        res.redirect(base_admin_path + 'apps')
        return 0;
    }
    if (req.cookies._APP_ !== id) {
        res.status(533).json(response_codes.code_533)
        return 0;
    }

    try {
        let app = await app_model.findById(id).populate({path: "owner", model: admin_model});

        if (!app) {
            res.status(533).json(response_codes.code_533)
            return 0;
        }
        if (!app.deployed) {
            res.status(534).json(response_codes.code_534)
            return 0;
        }
        if (!app.active) {
            res.status(535).json(response_codes.code_535)
            return 0;
        }

        let config = await get_app_basic_config(req, res, {
            app: model_to_json(app)
        })
        res.status(200).render('admin_panel/webservices', config);
    } catch (e) {
        let err = response_codes.code_500;
        err.error = e;
        res.status(500).json(err);
        return 0;
    }


});
router.get('/app/:id/chatbots', access_middleware, async function (req, res) {
    var id = req.params.id;
    if (!req.cookies || !req.cookies._APP_ || req.cookies._APP_ === 'false') {
        res.redirect(base_admin_path + 'apps')
        return 0;
    }
    if (req.cookies._APP_ !== id) {
        res.status(533).json(response_codes.code_533)
        return 0;
    }

    try {
        let app = await app_model.findById(id).populate({path: "owner", model: admin_model});

        if (!app) {
            res.status(533).json(response_codes.code_533)
            return 0;
        }
        if (!app.deployed) {
            res.status(534).json(response_codes.code_534)
            return 0;
        }
        if (!app.active) {
            res.status(535).json(response_codes.code_535)
            return 0;
        }

        let config = await get_app_basic_config(req, res, {
            app: model_to_json(app)
        })
        res.status(200).render('admin_panel/chatbots', config);
    } catch (e) {
        let err = response_codes.code_500;
        err.error = e;
        res.status(500).json(err);
        return 0;
    }


});

module.exports = router;
