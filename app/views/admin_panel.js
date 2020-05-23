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
const base_admin_path = env.root_path + env.control_panel_url;

router.get('/', function (req, res) {
    seo.title = 'Login :: ' + seo.title;
    res.status(200).render('admin_panel/login', {
        seo: seo,
        resources: resources.login,
        root_path: env.root_path,
        img_folder: site_files_path + 'img/',
        base_admin_path,
        params: param_converter({
            root_path: env.root_path,
            img_folder: site_files_path + 'img/',
            site_files_path,
            base_admin_path
        })
    });
});

router.get('/dashboard/', function (req, res) {
    seo.title = 'Dashboard :: ' + seo.title;
    res.status(200).render('admin_panel/dashboard', {
        seo: seo,
        resources: resources.dashboard,
        root_path: env.root_path,
        img_folder: site_files_path + 'img/',
        base_admin_path,
        params: param_converter({
            root_path: env.root_path,
            site_files_path,
            img_folder: site_files_path + 'img/',
            base_admin_path
        })
    });
});

module.exports = router;
