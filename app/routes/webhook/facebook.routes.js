const express = require('express');
const router = express.Router();

let moment = require('moment');
let axios = require('axios');


const modelEndpoint = require('../../models/chatbot.m');
const modelorigin = require('../../models/core/origin_chatbot');
const modelChatList = require('../../models/chat_list.m');
const modelChatConversation = require('../../models/chat_conversation');

var facebook = require("./socket").ensoSocket;


let fnc_send_chatlists = async function (id) {
    let listaDeChats = await modelChatList.find({
        endpoint_id: id
    }).sort({last_time: 'desc'});
    facebook.emit('chat_list_one:' + id, JSON.stringify(listaDeChats));
}

router.get("/:app_id/:endpoint", async function (req, res) {
    var endpoint = req.params.endpoint
    var app = req.params.app_id

    try {
        var data = await modelEndpoint.findOne({
            origin_chatbot: '6058bb97dd3a3c2e46dbe2a0',
            name: endpoint.trim(),
            app: app.trim(),
        });
        let verify = data.telegram_token
        // Verificar la coincidendia del token
        if (req.query["hub.verify_token"] === verify) {
            // Mensaje de exito y envio del token requerido
            console.log("webhook verificado!");
            res.status(200).send(req.query["hub.challenge"]);
        } else {
            // Mensaje de fallo
            console.error("La verificacion ha fallado, porque los tokens no coinciden");
            res.sendStatus(403);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal error'
        });
    }
});

// Todos eventos de mesenger sera apturados por esta ruta
router.post("/:app_id/:endpoint", async function (req, res) {
    // Verificar si el vento proviene del pagina asociada
    var endpoint = req.params.endpoint;
    var app = req.params.app_id
    var body = req.body;
    console.log(body.entry[0])
    try {
        let data = await modelEndpoint.findOne({
            origin_chatbot: '6058bb97dd3a3c2e46dbe2a0',
            name: endpoint.trim(),
            app: app.trim(),
        })

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Webhook path or method not found"
            });
        }

        var data_or = await modelorigin.findById(data.origin_chatbot)


        if (data && data.facebook_recipient && body.entry && body.entry[0] && body.entry[0].messaging &&  body.entry[0].messaging[0] && body.entry[0].messaging[0].sender && body.entry[0].messaging[0].sender.id && (data.facebook_recipient != body.entry[0].messaging[0].sender.id)) {
            console.log("entra",body.entry[0].messaging[0].sender.id,data.facebook_recipient)
            let chatlist = await modelChatList.findOne({
                endpoint_id: data._id,
                chat_id: body.entry[0].messaging[0].sender.id,
                origin_chatbot: data_or._id,
            });

            if (!chatlist) {
                let chatlist_nuevo = new modelChatList({
                    endpoint_id: data._id,
                    chat_id: body.entry[0].messaging[0].sender.id,
                    active_conv: false,
                    dt_reg: moment().format(),
                    origin_chatbot: data_or._id,
                    app: app
                });
                chatlist = await chatlist_nuevo.save();
            }
            if(body && body.entry && body.entry[0] && body.entry[0].messaging && body.entry[0].messaging[0] && body.entry[0].messaging[0].message && body.entry[0].messaging[0].message.text){
                console.log("entro por que traigo mensaje")
                chatlist.last_message = body.entry[0].messaging[0].message.text ;
                chatlist.last_time = moment().format();

            }

            await chatlist.save();
            let isText = false;


            if (body && body.entry && body.entry[0] && body.entry[0].messaging && body.entry[0].messaging[0] && body.entry[0].messaging[0].message && body.entry[0].messaging[0].message.text != '') {
                isText = true;
                var conv = new modelChatConversation({
                    message_id: body.entry[0].messaging[0].message.mid,
                    chatlist_id: chatlist._id,
                    chat_id: body.entry[0].messaging[0].sender.id,
                    text: body.entry[0].messaging[0].message.text,
                    full_json: JSON.stringify(body),
                    who_says: 'external',
                    origin_chatbot: data_or._id,
                    dt_reg: moment().format(),
                    app: app,

                });
            } else if (body.entry[0].messaging[0].message && body.entry[0].messaging[0].message.attachments && body.entry[0].messaging[0].message.attachments[0].type == "sticker" || body.entry[0].messaging[0].message && body.entry[0].messaging[0].message.attachments && body.entry[0].messaging[0].message.attachments[0].payload.sticker_id) {

                var conv = new modelChatConversation({
                    message_id: body.entry[0].messaging[0].message.mid,
                    chatlist_id: chatlist._id,
                    chat_id: body.entry[0].messaging[0].sender.id,
                    text: body.entry[0].messaging[0].message.attachments[0].payload.url,
                    full_json: JSON.stringify(body),
                    isRich: true,
                    rich_kind: 'sticker',
                    url: body.entry[0].messaging[0].message.attachments[0].payload.url,
                    who_says: 'external',
                    origin_chatbot: data_or._id,
                    dt_reg: moment().format(),
                    app: app,

                });

            } else if (body.entry[0].messaging[0].message && body.entry[0].messaging[0].message.attachments && body.entry[0].messaging[0].message.attachments[0].type == "audio") {

                var conv = new modelChatConversation({
                    message_id: body.entry[0].messaging[0].message.mid,
                    chatlist_id: chatlist._id,
                    chat_id: body.entry[0].messaging[0].sender.id,
                    text: '',
                    full_json: JSON.stringify(body),
                    isRich: true,
                    rich_kind: 'voice',
                    url: body.entry[0].messaging[0].message.attachments[0].payload.url,
                    who_says: 'external',
                    origin_chatbot: data_or._id,
                    dt_reg: moment().format(),
                    app: app,

                });

            } else if (body.entry[0].messaging[0].message && body.entry[0].messaging[0].message.attachments && body.entry[0].messaging[0].message.attachments[0].type == "file") {

                var conv = new modelChatConversation({
                    message_id: body.entry[0].messaging[0].message.mid,
                    chatlist_id: chatlist._id,
                    chat_id: body.entry[0].messaging[0].sender.id,
                    text: '',
                    full_json: JSON.stringify(body),
                    isRich: true,
                    rich_kind: "document",
                    url: body.entry[0].messaging[0].message.attachments[0].payload.url,
                    who_says: 'external',
                    origin_chatbot: data_or._id,
                    dt_reg: moment().format(),
                    app: app,

                });

            } else if (body.entry[0].messaging[0].message && body.entry[0].messaging[0].message.attachments && body.entry[0].messaging[0].message.attachments[0].type == "photo" && !body.entry[0].messaging[0].message && body.entry[0].messaging[0].message.attachments && body.entry[0].messaging[0].message.attachments[0].payload.sticker_id) {


                var conv = new modelChatConversation({
                    message_id: body.entry[0].messaging[0].message.mid,
                    chatlist_id: chatlist._id,
                    chat_id: body.entry[0].messaging[0].sender.id,
                    text: '',
                    full_json: JSON.stringify(body),
                    isRich: true,
                    rich_kind: 'photo',
                    url: body.entry[0].messaging[0].message.attachments[0].payload.url,
                    who_says: 'external',
                    origin_chatbot: data_or._id,
                    dt_reg: moment().format(),
                    app: app,

                });

            } else if (body.entry[0].messaging[0].message && body.entry[0].messaging[0].message.attachments && body.entry[0].messaging[0].message.attachments[0].type == "image") {

                var conv = new modelChatConversation({
                    message_id: body.entry[0].messaging[0].message.mid,
                    chatlist_id: chatlist._id,
                    chat_id: body.entry[0].messaging[0].sender.id,
                    text: body.entry[0].messaging[0].message.attachments[0].payload.url,
                    full_json: JSON.stringify(body),
                    isRich: true,
                    rich_kind: 'photo',
                    url: body.entry[0].messaging[0].message.attachments[0].payload.url,
                    who_says: 'external',
                    origin_chatbot: data_or._id,
                    dt_reg: moment().format(),
                    app: app,

                });
            } else if (body.entry[0].messaging[0].message && body.entry[0].messaging[0].message.attachments && body.entry[0].messaging[0].message.attachments[0].type == "video") {

                var conv = new modelChatConversation({
                    message_id: body.entry[0].messaging[0].message.mid,
                    chatlist_id: chatlist._id,
                    chat_id: body.entry[0].messaging[0].sender.id,
                    text: body.entry[0].messaging[0].message.attachments[0].payload.url,
                    full_json: JSON.stringify(body),
                    isRich: true,
                    rich_kind: 'animation',
                    url: body.entry[0].messaging[0].message.attachments[0].payload.url,
                    who_says: 'external',
                    origin_chatbot: data_or._id,
                    dt_reg: moment().format(),
                    app: app,

                });

            }

            var OBJCHAT = body.message;


            console.log("conv:", conv)
            let conversation
            if(conv){
                 conversation = await conv.save();
            }



            if (!conversation) {
                return res.status(503).json({
                    success: false,
                    message: 'Can not save conversation'
                });
            }

            fnc_send_chatlists(chatlist.endpoint_id);

            facebook.emit('chat_talk_one:' + chatlist._id, JSON.stringify(conversation));

        }else{
            console.log(" no entra",body.entry[0].messaging[0].sender.id,data.facebook_recipient)
        }

        res.sendStatus(200);

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'Internal error'
        })
    }
    ;


});


// Funcion donde se procesara el evento
function process_event(event) {
    // Capturamos los datos del que genera el evento y el mensaje
    var senderID = event.sender.id;
    var message = event.message;

    // Si en el evento existe un mensaje de tipo texto
    if (message.text) {
        // Crear un payload para un simple mensaje de texto
        var response = {
            "text": 'Enviaste este mensaje: ' + message.text
        }
    }

    // Enviamos el mensaje mediante SendAPI
    enviar_texto(senderID, response);
}


// Funcion donde el chat respondera usando SendAPI
function enviar_texto(senderID, response) {
    // Construcicon del cuerpo del mensaje
    let request_body = {
        "recipient": {
            "id": senderID
        },
        "message": response
    }

    // Enviar el requisito HTTP a la plataforma de messenger
    axios({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": {"access_token": process.env.PAGE_ACCESS_TOKEN},
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

module.exports = router;