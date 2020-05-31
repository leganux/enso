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

router.get('/', async function (req, res) {

    var i18n = await i18n_constructor.i18n_json(req);
    res.status(200).render('admin_panel/login', {
        seo: seo,
        resources: resources.login,
        root_path: env.root_path,
        img_folder: site_files_path + 'img/',
        base_admin_path,
        core_files_path,
        i18n,
        params: param_converter({
            root_path: env.root_path,
            img_folder: site_files_path + 'img/',
            site_files_path,
            base_admin_path,
            core_files_path,
            i18n
        })
    });
});

router.get('/dashboard/', access_middleware, async function (req, res) {
    let who = req.who;
    let scr_access = req.access;

    var i18n = await i18n_constructor.i18n_json(req);

    res.status(200).render('admin_panel/dashboard', {
        scr_access,
        seo: seo,
        resources: resources.dashboard,
        root_path: env.root_path,
        img_folder: site_files_path + 'img/',
        base_admin_path,
        core_files_path,
        i18n,
        user: req.user ? req.user : false,
        params: param_converter({
            root_path: env.root_path,
            site_files_path,
            img_folder: site_files_path + 'img/',
            base_admin_path,
            core_files_path,
            i18n,


        })
    });
});

router.get('/admin_roles/', access_middleware, async function (req, res) {
    let scr_access = req.access;
    var i18n = await i18n_constructor.i18n_json(req);

    res.status(200).render('admin_panel/admin_roles', {
        scr_access,
        seo: seo,
        resources: resources.dashboard,
        root_path: env.root_path,
        img_folder: site_files_path + 'img/',
        base_admin_path,
        core_files_path,
        i18n,
        user: req.user ? req.user : false,
        params: param_converter({
            root_path: env.root_path,
            site_files_path,
            img_folder: site_files_path + 'img/',
            base_admin_path,
            core_files_path,
            i18n
        })
    });
});

router.get('/admin/', access_middleware, async function (req, res) {
    let scr_access = req.access;
    var i18n = await i18n_constructor.i18n_json(req);

    res.status(200).render('admin_panel/admin', {
        scr_access,
        seo: seo,
        resources: resources.dashboard,
        root_path: env.root_path,
        img_folder: site_files_path + 'img/',
        base_admin_path,
        core_files_path,
        i18n,
        user: req.user ? req.user : false,
        params: param_converter({
            root_path: env.root_path,
            site_files_path,
            img_folder: site_files_path + 'img/',
            base_admin_path,
            core_files_path,
            i18n
        })
    });
});

router.get('/catalogue/routes/', access_middleware, async function (req, res) {
    let scr_access = req.access;
    var i18n = await i18n_constructor.i18n_json(req);

    res.status(200).render('admin_panel/catalogue_routes', {
        scr_access,
        seo: seo,
        resources: resources.dashboard,
        root_path: env.root_path,
        img_folder: site_files_path + 'img/',
        base_admin_path,
        core_files_path,
        i18n,
        user: req.user ? req.user : false,
        params: param_converter({
            root_path: env.root_path,
            site_files_path,
            img_folder: site_files_path + 'img/',
            base_admin_path,
            core_files_path,
            i18n
        })
    });
});

router.get('/catalogue/places/', access_middleware, async function (req, res) {
    let scr_access = req.access;
    var i18n = await i18n_constructor.i18n_json(req);

    res.status(200).render('admin_panel/catalogue_places', {
        scr_access,
        seo: seo,
        resources: resources.dashboard,
        root_path: env.root_path,
        img_folder: site_files_path + 'img/',
        base_admin_path,
        core_files_path,
        i18n,
        user: req.user ? req.user : false,
        params: param_converter({
            root_path: env.root_path,
            site_files_path,
            img_folder: site_files_path + 'img/',
            base_admin_path,
            core_files_path,
            i18n
        })
    });
});

router.get('/catalogue/languages/', access_middleware, async function (req, res) {
    let scr_access = req.access;
    var i18n = await i18n_constructor.i18n_json(req);

    res.status(200).render('admin_panel/catalogue_languages', {
        scr_access,
        seo: seo,
        resources: resources.dashboard,
        root_path: env.root_path,
        img_folder: site_files_path + 'img/',
        base_admin_path,
        core_files_path,
        i18n,
        user: req.user ? req.user : false,
        params: param_converter({
            root_path: env.root_path,
            site_files_path,
            img_folder: site_files_path + 'img/',
            base_admin_path,
            core_files_path,
            i18n
        })
    });
});

router.get('/catalogue/dynamic_content/', access_middleware, async function (req, res) {
    let scr_access = req.access;
    var i18n = await i18n_constructor.i18n_json(req);

    res.status(200).render('admin_panel/dynamic_content', {
        scr_access,
        seo: seo,
        resources: resources.dashboard,
        root_path: env.root_path,
        img_folder: site_files_path + 'img/',
        base_admin_path,
        core_files_path,
        i18n,
        user: req.user ? req.user : false,
        params: param_converter({
            root_path: env.root_path,
            site_files_path,
            img_folder: site_files_path + 'img/',
            base_admin_path,
            core_files_path,
            i18n
        })
    });
});

router.get('/admin_permission/', access_middleware, async function (req, res) {
    let scr_access = req.access;
    var i18n = await i18n_constructor.i18n_json(req);

    res.status(200).render('admin_panel/admin_permission', {
        scr_access,
        seo: seo,
        resources: resources.dashboard,
        root_path: env.root_path,
        img_folder: site_files_path + 'img/',
        base_admin_path,
        core_files_path,
        i18n,
        user: req.user ? req.user : false,
        params: param_converter({
            root_path: env.root_path,
            site_files_path,
            img_folder: site_files_path + 'img/',
            base_admin_path,
            core_files_path,
            i18n
        })
    });
});


router.get('/cdn/', access_middleware, async function (req, res) {
    let scr_access = req.access;
    var i18n = await i18n_constructor.i18n_json(req);

    res.status(200).render('admin_panel/cdn', {
        scr_access,
        seo: seo,
        resources: resources.dashboard,
        root_path: env.root_path,
        img_folder: site_files_path + 'img/',
        base_admin_path,
        core_files_path,
        i18n,
        user: req.user ? req.user : false,
        params: param_converter({
            root_path: env.root_path,
            site_files_path,
            img_folder: site_files_path + 'img/',
            base_admin_path,
            core_files_path,
            i18n
        })
    });
});

router.get('/console_log/', access_middleware, async function (req, res) {
    let scr_access = req.access;
    var i18n = await i18n_constructor.i18n_json(req);

    res.status(200).render('admin_panel/console_log', {
        scr_access,
        seo: seo,
        resources: resources.dashboard,
        root_path: env.root_path,
        img_folder: site_files_path + 'img/',
        base_admin_path,
        core_files_path,
        i18n,
        user: req.user ? req.user : false,
        params: param_converter({
            root_path: env.root_path,
            site_files_path,
            img_folder: site_files_path + 'img/',
            base_admin_path,
            core_files_path,
            i18n,
            general_socket_path: env.root_path + env.socket_path,
        })
    });
});

router.get('/apps/', access_middleware, async function (req, res) {
    let scr_access = req.access;
    var i18n = await i18n_constructor.i18n_json(req);

    console.info(req.user)
    res.status(200).render('admin_panel/apps', {
        scr_access,
        seo: seo,
        resources: resources.dashboard,
        root_path: env.root_path,
        img_folder: site_files_path + 'img/',
        base_admin_path,
        core_files_path,
        i18n,
        user: req.user ? req.user : false,
        params: param_converter({
            root_path: env.root_path,
            site_files_path,
            img_folder: site_files_path + 'img/',
            base_admin_path,
            core_files_path,
            i18n,
        })
    });
});

module.exports = router;
