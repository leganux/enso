const express = require('express');
const router = express.Router();
const api_crud = require('../helpers/api_crud_constructor_app.helper');
const access_middleware = require('./../auth/auth.middleware').auth
const app = require('./../models/core/app.m')
const country = require('./../models/core/country.m')
const state = require('./../models/core/state.m')
const city = require('./../models/core/city.m')
var path = require('path');
const fs = require('fs');
const { fork } = require('child_process');
const contact_direction = require('./../models/contact_direction.m');

const response_codes = require('./../helpers/response_codes.helper').codes;


//api_crud.all(router, contact_direction, access_middleware, false, 'name');

router.get("/:app_id/", (req, res) => {
    contact_direction.find({}, (err, dir) => {
        if (err) {
            return res.status(500).send({ message: "Error al realizar la peticion" })
        }
        if (!dir) {
            return res.status(400).send({ message: "No hay direcciones" })
        }

        res.status(200).send(dir)
    }).sort({$natural:-1}).limit(1)

})




module.exports = router;