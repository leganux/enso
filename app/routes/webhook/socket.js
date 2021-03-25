const env = require('../../config/environment.config').environment;
var io = require('../../system/socket_server.system').io;
const request = require("axios")
const moment = require('moment')

const modelEndpoint = require('../../models/chatbot.m');
const modelChatList = require('../../models/chat_list.m');
const modelChatConversation = require('../../models/chat_conversation');
const modelorigin = require('../../models/core/origin_chatbot')
//let dfFunctions = require('./dialogflowFunctions');

console.log("******", env.root_path)

var ensoSocket = {};
if (env.active_socket) {
    console.log(env.root_path)

    function makeid(length){
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
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
            socket.on('chat_talk:send',async function (nuevo) {
                console.log("llego",nuevo)
                let mensaje = JSON.parse(nuevo)
                console.log("llego",mensaje)
                let listaDeChats = await modelChatList.findById(mensaje.chat)
                let chatbot = await modelEndpoint.findById(listaDeChats.endpoint_id)


                var mensaje_nuevo = new modelChatConversation({
                    message_id: makeid(10),
                    chatlist_id: mensaje.chat,
                    chat_id: listaDeChats.chat_id,
                    text: mensaje.text,
                    isRich: false,
                    who_says: 'me',
                    origin_chatbot: listaDeChats.origin_chatbot,
                    dt_reg: moment().format(),
                    app: mensaje.app
                })
                mensaje_nuevo.full_json = JSON.stringify(mensaje_nuevo),
                console.log(mensaje_nuevo)
                let messaje_save = await mensaje_nuevo.save()

                if (!messaje_save) {
                    return res.status(503).json({
                        success: false,
                        message: 'Can not save message'
                    });
                }
                let url = 'https://api.telegram.org/bot' + chatbot.telegram_token + '/sendMessage';

                request.post(url,
                    {
                        chat_id:  listaDeChats.chat_id,
                        text: mensaje.text
                    })
                    .then((response) => {}).catch((error) => {
                    console.error(error)
                });
                socket.emit('chat_talk_one:' + mensaje.chat, JSON.stringify(mensaje_nuevo));


            })
            socket.on('chat_talk:deactive_conversation', async function (id) {

                let converSation = await modelChatList.findById(id)
                converSation.active_conv = false;
                await converSation.save();

            });


            socket.on('chat_spy:conversation', async function (id) {

                let converSation = await modelChatList.findById(id)
                converSation.active_conv = true? true:false;
                await converSation.save();

                let listaDeElementos = await modelChatConversation.find({
                    chatlist_id: id
                }).sort({dt_reg: 'asc'});
                listaDeElementos.map((item, i) => {
                    socket.emit('chat_talk_one:' + id, JSON.stringify(item));
                })
            });
            socket.on('chat_speak:conversation', async function (id) {

                let converSation = await modelChatList.findById(id)
                converSation.active_conv = true;
                await converSation.save();

                let listaDeElementos = await modelChatConversation.find({
                    chatlist_id: id
                }).sort({dt_reg: 'asc'});
                listaDeElementos.map((item, i) => {
                    socket.emit('chat_talk_one:' + id, JSON.stringify(item));
                })
            });

            socket.on('chat_talk:conversation', async function (id) {

                let converSation = await modelChatList.findById(id)
                converSation.active_conv = true;
                await converSation.save();

                let listaDeElementos = await modelChatConversation.find({
                    chatlist_id: id
                }).sort({dt_reg: 'asc'});
                listaDeElementos.map((item, i) => {
                    dashFlowSocket.emit('chat_talk_one:' + id, JSON.stringify(item));
                })
            });
            socket.on('chat_talk_one:send', async function (msg) {
                console.log("awqass",msg)
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