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

router.get('/', async function (req, res) {

    var i18n = await i18n_constructor.i18n_json(req);
    seo.title = 'Login :: ' + seo.title;
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

router.get('/dashboard/', async function (req, res) {
    var i18n = await i18n_constructor.i18n_json(req);
    seo.title = 'Dashboard :: ' + seo.title;
    res.status(200).render('admin_panel/dashboard', {
        seo: seo,
        resources: resources.dashboard,
        root_path: env.root_path,
        img_folder: site_files_path + 'img/',
        base_admin_path,
        core_files_path,
        i18n,
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

router.get('/admin_roles/', async function (req, res) {
    var i18n = await i18n_constructor.i18n_json(req);
    seo.title = 'Admin roles :: ' + seo.title;
    res.status(200).render('admin_panel/admin_roles', {
        seo: seo,
        resources: resources.dashboard,
        root_path: env.root_path,
        img_folder: site_files_path + 'img/',
        base_admin_path,
        core_files_path,
        i18n,
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

router.get('/admin/', async function (req, res) {
    var i18n = await i18n_constructor.i18n_json(req);
    seo.title = 'Admin roles :: ' + seo.title;
    res.status(200).render('admin_panel/admin', {
        seo: seo,
        resources: resources.dashboard,
        root_path: env.root_path,
        img_folder: site_files_path + 'img/',
        base_admin_path,
        core_files_path,
        i18n,
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

router.get('/catalogue/routes/', async function (req, res) {
    var i18n = await i18n_constructor.i18n_json(req);
    seo.title = 'Catalogue of routes :: ' + seo.title;
    res.status(200).render('admin_panel/catalogue_routes', {
        seo: seo,
        resources: resources.dashboard,
        root_path: env.root_path,
        img_folder: site_files_path + 'img/',
        base_admin_path,
        core_files_path,
        i18n,
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

router.get('/catalogue/places/', async function (req, res) {
    var i18n = await i18n_constructor.i18n_json(req);
    seo.title = 'Catalogue of places :: ' + seo.title;
    res.status(200).render('admin_panel/catalogue_places', {
        seo: seo,
        resources: resources.dashboard,
        root_path: env.root_path,
        img_folder: site_files_path + 'img/',
        base_admin_path,
        core_files_path,
        i18n,
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

router.get('/catalogue/languages/', async function (req, res) {
    var i18n = await i18n_constructor.i18n_json(req);
    seo.title = 'Catalogue of places :: ' + seo.title;
    res.status(200).render('admin_panel/catalogue_languages', {
        seo: seo,
        resources: resources.dashboard,
        root_path: env.root_path,
        img_folder: site_files_path + 'img/',
        base_admin_path,
        core_files_path,
        i18n,
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

router.get('/admin_permission/', async function (req, res) {
    var i18n = await i18n_constructor.i18n_json(req);
    seo.title = 'Admin permisions :: ' + seo.title;
    res.status(200).render('admin_panel/admin_permission', {
        seo: seo,
        resources: resources.dashboard,
        root_path: env.root_path,
        img_folder: site_files_path + 'img/',
        base_admin_path,
        core_files_path,
        i18n,
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


module.exports = router;
