const express = require('express');
const router = express.Router();
const api_crud = require('../helpers/api_crud_constructor_app.helper');
const contacts = require('../models/contacts.m');
const access_middleware = require('./../auth/auth.middleware').auth
const app = require('./../models/core/app.m')
const dir = require('./../models/contact_direction.m')
const country = require('./../models/core/country.m')
const state = require('./../models/core/state.m')
const city = require('./../models/core/city.m')
var path = require('path');
const fs = require('fs');
const { fork } = require('child_process');
const response_codes = require('./../helpers/response_codes.helper').codes;


api_crud.all(router, contacts, access_middleware, false, 'name');