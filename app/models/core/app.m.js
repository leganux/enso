const mongoose = require('mongoose');
const {Schema} = mongoose;
const moment = require('moment');
const dataTables = require('mongoose-datatables');
const admin = require('./admin.m')
const randomGenerator = require('../../helpers/random_generator.helper');
const { randomGenerator_number } = require('../../helpers/random_generator.helper');



const app = new Schema({
    name: {
        type: String,
        required: false,
        unique: true
    },
    description: {
        type: String,
        required: false
    },
    token: {
        type: String,
        required: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: admin
    },
    default_role: {
        type: String,
        required: false,

    },
    default_role_new: {
        type: String,
        required: false,

    },
    deployed: {
        type: Boolean,
        required: true,
        default: false
    },
    db_host: {
        type: String,
        required: true,
        default: '127.0.0.1'
    },
    db_port: {
        type: String,
        required: true,
        default: '27017'
    },
    db_user: {
        type: String,
        required: false,
    },
    db_name: {
        type: String,
        required: true,
        default: randomGenerator.randomGenerator_number
    },
    db_password: {
        type: String,
        required: false,
    },
    mail_service: {
        type: String,
        required: true,
        default: 'smtp'
    },
    mail_host: {
        type: String,
        required: false,
    },
    mail_port: {
        type: String,
        required: false,
    },
    mail_user: {
        type: String,
        required: false,
    },
    mail_pass: {
        type: String,
        required: false,
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    allow_register: {
        type: Boolean,
        required: true,
        default: true
    },
    allow_see_backoffice: {
        type: Boolean,
        required: true,
        default: true
    },
    allow_see_reset_password: {
        type: Boolean,
        required: true,
        default: true
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
});

app.plugin(dataTables);
module.exports = mongoose.model('app', app);























