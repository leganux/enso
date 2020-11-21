const mongoose = require('mongoose');
const {Schema} = mongoose;
const moment = require('moment')
const dataTables = require('mongoose-datatables')
const app = require('./core/app.m')

const user_role = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
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
        default: moment
    },
    updatedAt: {
        type: Date,
        required: true,
        default: moment
    },
});

user_role.plugin(dataTables);
module.exports = mongoose.model('user_role', user_role);























