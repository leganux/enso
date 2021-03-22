const mongoose = require('mongoose');
const {Schema} = mongoose;
const moment = require('moment')
const dataTables = require('mongoose-datatables')

const origin_chatbot = new Schema({

    origin: {
        type: Number, //1 facebook 2 telegram 3 web 4 other
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    active:{
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

origin_chatbot.plugin(dataTables);
module.exports = mongoose.model('origin_chatbot', origin_chatbot);




