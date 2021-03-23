const env = require('../../config/environment.config').environment;
var io = require('../../system/socket_server.system').io;
const request = require("axios")
const moment = require('moment')

const modelEndpoint = require('../../models/chatbot.m');
const modelChatList = require('../../models/chat_list.m');
const modelChatConversation = require('../../models/chat_conversation');
//let dfFunctions = require('./dialogflowFunctions');

console.log("******", env.root_path)

var ensoSocket = {};
if (env.active_socket) {
    console.log(env.root_path)

    ensoSocket = io
        .of(env.root_path + '/ensoSocket')
        .on('connection', function (socket) {
            console.log("COnnectd socket")


            socket.on('chat_list:get_all', async function (id) {
                console.log("aqui")
                let listaDeChats = await modelChatList.find({
                    endpoint_id: id
                }).sort({last_time: 'asc'});

                socket.emit('chat_list_one:' + id, JSON.stringify(listaDeChats));
            });

            socket.on('chat_talk_one:send', async function (msg) {
                let data = JSON.parse(msg);

                let chatlist = await modelChatList.findById(data.chatlist_id);

                if (!chatlist) {
                    return false;
                }

                let endpoint = await modelEndpoint.findById(chatlist.endpoint_id);

                if (!endpoint) {
                    return false;
                }

                if (chatlist.platform == "TELEGRAM") {
                    let url = 'https://api.telegram.org/bot' + endpoint.token + '/sendMessage';

                    let obj = new modelChatConversation(data);
                    let rest = await obj.save();
                    axios.post(url,
                        {
                            chat_id: data.chat_id,
                            text: data.text
                        })
                        .then((response) => {}).catch((error) => {
                        console.error(error)
                    });
                }

                if (chatlist.platform == "WEB") {
                    let obj = new modelChatConversation(data);
                    let rest = await obj.save();
                    ensoSocket.emit('DF_chatWeb:' + chatlist.endpoint_id + ':' + data.chat_id, JSON.stringify(rest));
                }
                if (chatlist.platform == "MESSENGER") {
                    //Guardar el mensaje en la base de datos
                    let obj = new modelChatConversation(data);
                    let rest = await obj.save();
                    // Construcicon del cuerpo del mensaje
                    let request_body = {
                        "recipient": {
                            "id": chatlist.chat_id
                        },
                        "message": {
                            "text": data.text
                        }
                    }

                    // Enviar el requisito HTTP a la plataforma de messenger
                    request({
                        "uri": "https://graph.facebook.com/v2.6/me/messages",
                        "qs": {"access_token": endpoint.fb_access_token},
                        "method": "POST",
                        "json": request_body
                    }, (err, res, body) => {
                        if (!err) {
                            console.log('Mensaje enviado!')
                        } else {
                            console.error("No se puedo enviar el mensaje:" + err);
                        }
                    });
                }
            });
        })

}

module.exports = {
    ensoSocket : ensoSocket
};