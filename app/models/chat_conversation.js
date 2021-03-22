const mongoose = require('mongoose');
const {Schema} = mongoose;

const ChatList = require('./chat_list.m')

const chatListSchema = new Schema({
    chatlist_id: {type: Schema.Types.ObjectId, required: true, ref: ChatList},
    chat_id: {type: String, required: false},
    text: {type: String, required: false},
    richJSON: {type: String, required: false},
    full_json: {type: String, required: false},
    rich_kind: {type: String, required: false}, //sitcker, animation,document,voice,photo
    url: {type: String, required: false},
    isRich: {type: Boolean, required: true, default: false},
    who_says: {type: String, required: false},//me,external
    platform: {type: String, required: false},
    dt_reg: {type: Date, required: true},

});

module.exports = mongoose.model('chat_conversations', chatListSchema);
