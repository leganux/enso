const mongoose = require('mongoose');
const {Schema} = mongoose;
const moment = require('moment');
const dataTables = require('mongoose-datatables');


const routes = new Schema({
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

routes.plugin(dataTables);
module.exports = mongoose.model('routes', routes);























