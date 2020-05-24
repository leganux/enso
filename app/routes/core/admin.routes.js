const express = require('express');
const router = express.Router();
const response_codes = require('./../../helpers/response_codes.helper').codes;
const admin_model = require('./../../models/core/associations.m').Admin
const admin_role_model = require('./../../models/core/associations.m').Admin_role
const env = require('./../../config/environment.config').environment
const bcrypt = require('bcryptjs');
const saltRounds = env.bcryp_salt_rounds;


router.post('/', async function (req, res) {
    var admin = req.body;
    admin.password = await bcrypt.hash(admin.password, saltRounds);
    try {
        var response = await admin_model.create(admin);
        if (!response) {
            res.status(433).json(response_codes.code_433);
            return 0;
        }
        let ret = response_codes.code_200;
        ret.data = response;
        res.status(200).json(ret);
        return 0;
    } catch (e) {
        console.error('*** Error admin_roles', e);
        res.status(500).json(response_codes.code_500);
        return 0;
    }
});

router.get('/', async function (req, res) {
    var query = req.query;

    try {
        let query_ = {};
        if (query.where) {
            query_ = query.where;
        }
        query_.include = [{
            model: admin_role_model
        }]
        var response = await admin_model.findAll(query_);
        if (!response) {
            res.status(404).json(response_codes.code_404);
            return 0;
        }
        let ret = response_codes.code_200;
        ret.data = response;
        res.status(200).json(ret);
        return 0;

    } catch (e) {
        console.error('*** Error admin_roles', e);
        res.status(500).json(response_codes.code_500);
        return 0;
    }
});

router.get('/:id', async function (req, res) {
    let id = req.params.id;

    try {
        var response = await admin_model.findByPk(id);
        if (!response) {
            res.status(404).json(response_codes.code_404);
            return 0;
        }
        let ret = response_codes.code_200;
        ret.data = response;
        res.status(200).json(ret);
        return 0;

    } catch (e) {
        console.error('*** Error admin_roles', e);
        res.status(500).json(response_codes.code_500);
        return 0;
    }
});

router.put('/:id', async function (req, res) {
    let body = req.body;
    let id = req.params.id;

    try {
        if (body.password) {
            body.password = await bcrypt.hash(body.password, saltRounds);
        }
        var response = await admin_model.update(
            body,
            {
                where: {id: id}
            }
        );
        if (!response) {
            res.status(434).json(response_codes.code_434);
            return 0;
        }

        let ret = response_codes.code_200;
        ret.data = response;
        res.status(200).json(ret);
        return 0;

    } catch (e) {
        console.error('*** Error admin_roles', e);
        res.status(500).json(response_codes.code_500);
        return 0;
    }
});

router.delete('/:id', async function (req, res) {

    let id = req.params.id;

    try {
        var response = await admin_model.destroy(
            {
                where: {id: id}
            }
        );
        if (!response) {
            res.status(404).json(response_codes.code_404);
            return 0;
        }

        let ret = response_codes.code_200;
        ret.data = response;
        res.status(200).json(ret);
        return 0;

    } catch (e) {
        console.error('*** Error admin_roles', e);
        res.status(500).json(response_codes.code_500);
        return 0;
    }
});


module.exports = router;
