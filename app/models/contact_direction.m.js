const mongoose = require('mongoose');
const { Schema } = mongoose;
const moment = require('moment');
const dataTables = require('mongoose-datatables');

const app = require('./core/app.m');
const country = require('../models/core/country.m');
const state = require('../models/core/state.m');
const city = require('../models/core/city.m');
const { schema } = require('./core/app.m');

const contact_direction = new Schema({
    country: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: country
    },
    state: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: state
    },
    city: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: city
    },
    postalCode: {
        type: Number,
        required: false,
    },
    street: {
        type: String,
        required: false,
    },
    ExtNumber: { // internal or external number
        type: Number,
        required: false,
    },
    IntNUmber: {
        type: Number,
        required: false,
    },
    reference:{
        type: String,
        required: false,
    },
    app: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: app
    },
    createdAt: {
        type: Date,
        required: true,
        default: moment
    },
    updatedAt: {
        type: Date,
        required: true,
        default: moment
    },

})


contact_direction.plugin(dataTables);
module.exports = mongoose.model('contact_direction', contact_direction);



