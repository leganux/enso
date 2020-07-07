const mongoose = require('mongoose');
const {Schema} = mongoose;
const moment = require('moment');
const dataTables = require('mongoose-datatables');

const app = require('./core/app.m');


const user_routes = new Schema({
    url: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    methods: {
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

user_routes.plugin(dataTables);
module.exports = mongoose.model('user_routes', user_routes);























