const express = require('express');
const router = express.Router();
const api_crud = require('../helpers/api_crud_constructor_app.helper');
const webservice = require('../models/webservice.m');
const params = require("../models/webservice_params.m")
const type = require("../models/core/param_type.m")
const group = require('../models/contact_group.m')
const access_middleware = require('./../auth/auth.middleware').auth
const app = require('./../models/core/app.m')
var path = require('path');
const fs = require('fs');
const { fork } = require('child_process');
const response_codes = require('./../helpers/response_codes.helper').codes;
const { findById, findByIdAndUpdate } = require('./../models/core/app.m');
const { response } = require('express');
const axios = require("axios");
const { route } = require('./webservice_params.routes');


var get_app_id = function (req) {
    if (!req.params || !req.params.app_id) {
        return false;
    } else {
        return req.params.app_id;
    }
}

var populate = [{
    path: 'app',
    model: app
},
    {
        path: 'params',
        model: params,
        populate: [
            {
                path: 'app',
                model: app
            },
            {
                path: 'paramtype',
                model: type,
            }

        ]
    }]



module.exports = router;
