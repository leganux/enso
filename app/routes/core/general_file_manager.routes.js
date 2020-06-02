const express = require('express');
const router = express.Router();
const api_crud = require('../../helpers/api_crud_constructor.helper');
const env = require('./../../config/environment.config').environment
const folder_scanner = require('../../helpers/folder_scaner.helper').walk2model;
const response_codes = require('../../helpers/response_codes.helper').codes;
const lodash = require('lodash')
const moment = require('moment')
const fs = require('fs')

const file_manager = require('./../../models/core/general_file_manager.m');
const admin = require('./../../models/core/admin.m');
const path = require('path');


const access_middleware = require('./../../auth/auth.middleware').auth

api_crud.datatable(router, file_manager, access_middleware, [{path: 'owner', model: admin}], 'url,type');
api_crud.readById(router, file_manager, access_middleware, [{path: 'owner', model: admin}], 'url,type');

const make_id = function (length) {
    if (!length) {
        length = 11;
    }
    var a = '';

    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        a += characters.charAt(Math.floor(Math.random() * charactersLength));

    }
    return a;
}
const get_extension = function (string) {
    let cad = string.split('.');
    let length = cad.length
    return cad[length - 1]
}

router.post('/upload', access_middleware, async function (req, res) {

    if (!req.files) {
        res.satus(435).json(response_codes.code_435)
        return false;
    }


    try {
        let file = req.files.file;


        let extension = get_extension(file.name);
        let new_name = make_id(11) + '_' + lodash.snakeCase(file.name) + '.' + extension

        let year = moment().format('YYYY')
        let month = moment().format('MM')
        let day = moment().format('DD')
        let file_folder = path.join(__dirname, './../../public/files/')
        let file_folder_year = path.join(file_folder, year)
        let file_folder_month = path.join(file_folder, year, month)
        let file_folder_day = path.join(file_folder, year, month, day)
        let file_ = path.join(file_folder, year, month, day) + '/' + new_name;

        let public_acces_url = env.root_path + 'content/files/' + year + '/' + month + '/' + day + '/' + new_name

        if (!fs.existsSync(file_folder_year)) {
            fs.mkdirSync(file_folder_year);
        }
        if (!fs.existsSync(file_folder_month)) {
            fs.mkdirSync(file_folder_month);
        }
        if (!fs.existsSync(file_folder_day)) {
            fs.mkdirSync(file_folder_day);
        }

        file.mv(file_, async function (err) {
            if (err) {
                res.status(437).json(response_codes.code_437)
                return false;
            }

            let _s = new file_manager({
                url: public_acces_url,
                path: file_,
                original_name: file.name,
                owner: req.user && req.user.user ? req.user.user : '',
                actived: true,
                createdAt: moment().format(),
                updatedAt: moment().format()

            })
            await _s.save();
            let ret = response_codes.code_200
            ret.file = _s.url;
            ret.data = _s
            res.status(200).json(ret)
            return 0
        });


    } catch (e) {
        res.status(500).json(response_codes.code_500)
        console.error(e)
        return false;
    }


});

router.delete('/:id', access_middleware, async function (req, res) {
    let ID = req.params.id;
    try {
        let fm = await file_manager.findById(ID);
        if (!fm) {
            res.status(404).json(response_codes.code_404);
            return 0;
        }
        try {
            fs.unlinkSync(fm.path);
        } catch (e) {

        }

        let response = await file_manager.findByIdAndRemove(ID);

        if (!response) {
            res.status(404).json(response_codes.code_404);
            return 0;
        }

        let ret = response_codes.code_200;
        ret.data = response;
        res.status(200).json(ret);
        return 0;

    } catch (e) {
        console.error('*** Error en READ ' + model.collection.collectionName, e);
        res.status(500).json(response_codes.code_500);
        return 0;
    }

})

module.exports = router;
