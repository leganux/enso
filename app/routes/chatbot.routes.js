const express = require('express');
const router = express.Router();
const api_crud = require('../helpers/api_crud_constructor_app.helper');

const access_middleware = require('./../auth/auth.middleware').auth
const app = require('./../models/core/app.m')
const chatbottype = require("./../models/core/chetbot_type.m")
const originChatbot = require("./../models/core/origin_chatbot")
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
},{
    path: 'origin_chatbot',
    model: originChatbot,
}]



api_crud.updateOrCreate(router, chatbot, access_middleware);

api_crud.create(router, chatbot, access_middleware);


api_crud.update(router, chatbot, access_middleware);
api_crud.updateWhere(router, chatbot, access_middleware);
api_crud.readOne(router, chatbot, access_middleware, populate);
api_crud.readById(router, chatbot, false, populate);
api_crud.read(router, chatbot, access_middleware, populate);
api_crud.delete(router, chatbot, access_middleware);

api_crud.datatable(router, chatbot, access_middleware, populate, 'name');


module.exports = router;
