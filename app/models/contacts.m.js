const mongoose = require('mongoose');
const { Schema } = mongoose;
const moment = require('moment');
const dataTables = require('mongoose-datatables');

const app = require('./core/app.m');
const group = require('./contact_group.m');
const contact_direction = require('./contact_direction.m');


const contact = new Schema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    email: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    lada: {
        type: String,
        required: false,
    },
    phone: {
        type: Number,
        required: false,
    },
    direction: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: contact_direction
    },
    app: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: app
    },
    group: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: group
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

contact.plugin(dataTables);
module.exports = mongoose.model('contacts', contact);























