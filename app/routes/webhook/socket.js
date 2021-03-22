var env = require('../../config/environment.config');
var io = require('../../index').io;

const request = require("axios")
const moment = require('moment')

const modelEndpoint = require('../../models/chatbot.m');
const modelChatList = require('../../models/NOSQL/chat_list.model');
const modelChatConversation = require('../../models/NOSQL/chat_conversations.model');
//let dfFunctions = require('./dialogflowFunctions');


var dashFlowSocket = {};
if (env.active_socket) {

    dashFlowSocket = io
        .of(env.root_path + '/ensoSocket')
        .on('connection', function (socket) {
            console.log("COnnectd socket")
            socket.on('chat_list:get_all', async function (id) {
                let listaDeChats = await modelChatList.find({
                    endpoint_id: id
                }).sort({last_time: 'asc'});

                dashFlowSocket.emit('chat_list_one:' + id, JSON.stringify(listaDeChats));
            });
        })

}