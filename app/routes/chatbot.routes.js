const express = require('express');
const router = express.Router();
const api_crud = require('../helpers/api_crud_constructor_app.helper');

const access_middleware = require('./../auth/auth.middleware').auth
const app = require('./../models/core/app.m')
const chatbottype = require("./../models/core/chetbot_type.m")
const chatbot = require("./../models/chatbot.m")
var path = require('path');
const fs = require('fs');
const {fork} = require('child_process');
const response_codes = require('./../helpers/response_codes.helper').codes;
const {findById, findByIdAndUpdate} = require('./../models/core/app.m');
const {response} = require('express');
const axios = require("axios");
const {route} = require('./webservice_params.routes');



var populate = [{
    path: 'app',
    model: app
}, {
    path: 'chatbot_type',
    model: chatbottype,
}]


api_crud.all(router, chatbot, access_middleware, populate, 'name');


module.exports = router;
