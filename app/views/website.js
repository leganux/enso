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

const base_admin_path = env.root_path + env.control_panel_url;
const i18n_constructor = require('./../helpers/i18n_json_constructor.helper')
const access_middleware = require('./../auth/auth.middleware').auth
const app_model = require('./../models/core/app.m')
const admin_model = require('./../models/core/admin.m')


router.get('/app/login/:app_id', async function (req, res) {

    let _app_id_ = req.params.app_id;

    let my_app = await app_model.findById(_app_id_)

    if (!my_app) {
        res.status(404).json(response_codes.code_404)
        return 0;
    }
    if (!my_app.active) {
        res.status(535).json(response_codes.code_535)
        return 0;
    }

    var i18n = await i18n_constructor.i18n_json(req);
    res.status(200).render('website/login', {
        seo: seo,
        resources: resources.login,
        root_path: env.root_path,
        img_folder: site_files_path + 'img/',
        base_admin_path,
        core_files_path,
        i18n,
        app: my_app,
        _app_id_: _app_id_,
        params: param_converter({
            root_path: env.root_path,
            img_folder: site_files_path + 'img/',
            site_files_path,
            base_admin_path,
            core_files_path,
            i18n,
            app: my_app,
            _app_id_: _app_id_
        })
    });
});


module.exports = router;