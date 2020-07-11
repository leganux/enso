const mongoose = require('mongoose');
const {Schema} = mongoose;
const moment = require('moment');
const dataTables = require('mongoose-datatables');

const app = require('./core/app.m');
const fields = require('./dynamic_db_structure.m');


const dynamic_db_collection = new Schema({
    name: {
        type: String,
        required: true,
        unique:true
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
    fields: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: fields
    }],
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

dynamic_db_collection.plugin(dataTables);
module.exports = mongoose.model('dynamic_db_collection', dynamic_db_collection);























