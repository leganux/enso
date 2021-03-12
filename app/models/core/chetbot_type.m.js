const mongoose = require('mongoose');
const {Schema} = mongoose;
const moment = require('moment')
const dataTables = require('mongoose-datatables')

const chatbot_type = new Schema({

    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    key: {
        type: Number, //1 Ventas "Bremer" 2 Reservas "" 3 Soporte "karen" 4 Custom
        required: true
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

chatbot_type.plugin(dataTables);
module.exports = mongoose.model('chatbot_type', chatbot_type);




