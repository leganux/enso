const mongoose = require('mongoose');
const {Schema} = mongoose;
const moment = require('moment');
const dataTables = require('mongoose-datatables');

const app = require('./core/app.m');


const cron_functions = new Schema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    description: {
        type: String,
        required: false,
    },
    content: {
        type: String,
        required: false
    },
    cron_string: {
        type: String,
        required: false
    },
    minute: {
        type: String,
        required: false
    },
    hour: {
        type: String,
        required: false
    },
    day_of_mont: {
        type: String,
        required: false
    },
    day_of_week: {
        type: String,
        required: false
    },
    month_of_year: {
        type: String,
        required: false
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    app: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: app
    },

    createdAt: {
        type: Date,
        required: true,
        default: moment().format()
    },
    updatedAt: {
        type: Date,
        required: true,
        default: moment().format()
    },
});

cron_functions.plugin(dataTables);
module.exports = mongoose.model('cron_functions', cron_functions);























