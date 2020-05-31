const express = require('express');
const router = express.Router();
const api_crud = require('../../helpers/api_crud_constructor.helper');
const env = require('./../../config/environment.config').environment
const folder_scanner = require('../../helpers/folder_scaner.helper').walk2model;
const response_codes = require('../../helpers/response_codes.helper').codes;
const lodash = require('lodash')

const cdn = require('./../../models/core/cdn.m');
const path = require('path');
const public_root_folder = require('./../../index').public_folder_root
var AdmZip = require('adm-zip');
var fs = require('fs');

const access_middleware = require('./../../auth/auth.middleware').auth

api_crud.all(router, cdn, access_middleware, false, 'url,type');


router.post('/scan_folder', access_middleware, async function (req, res) {

    var fullUrl = req.protocol + '://' + req.get('host') + env.root_path + 'content/';

    try {
        await cdn.deleteMany();
        await folder_scanner(path.join(__dirname, './../../public/cdn/'), false, '.js', path.join(__dirname, './../../public/'), cdn, fullUrl);
        await folder_scanner(path.join(__dirname, './../../public/cdn/'), false, '.css', path.join(__dirname, './../../public/'), cdn, fullUrl);
        await folder_scanner(path.join(__dirname, './../../public/cdn/'), false, '.woff', path.join(__dirname, './../../public/'), cdn, fullUrl);
        await folder_scanner(path.join(__dirname, './../../public/cdn/'), false, '.eot', path.join(__dirname, './../../public/'), cdn, fullUrl);
        await folder_scanner(path.join(__dirname, './../../public/cdn/'), false, '.ttf', path.join(__dirname, './../../public/'), cdn, fullUrl);
        await folder_scanner(path.join(__dirname, './../../public/cdn/'), false, '.otf', path.join(__dirname, './../../public/'), cdn, fullUrl);
        let ret = response_codes.code_200;
        res.status(200).json(ret);
    } catch (e) {
        res.status(500).json(response_codes.code_500)
        console.error(e)
    }


});

router.post('/zip_uploader', access_middleware, async function (req, res) {


    if (!req.files) {
        res.satus(435).json(response_codes.code_435)
        return false;
    }


    try {

        let file = req.files.file;
        if (!file.mimetype.includes('zip')) {
            res.satus(415).json(response_codes.code_415)
            return false;
        }

        let file_ = path.join(__dirname, './../../public/cdn/uploads/' + lodash.snakeCase(file.name) + '.zip')
        let file_folder = path.join(__dirname, './../../public/cdn/uploads/' + lodash.snakeCase(file.name))
        if (!fs.existsSync(file_folder)) {
            fs.mkdirSync(file_folder);
        }

        file.mv(file_, async function (err) {
            if (err) {
                res.status(437).json(response_codes.code_437)
                return false;
            }

            var zip = new AdmZip(file_);
            zip.extractAllTo(file_folder, true)
            res.status(200).json(response_codes.code_200)
            return 0
        });

    } catch (e) {
        res.status(500).json(response_codes.code_500)
        console.error(e)
        return false;
    }


});

module.exports = router;
