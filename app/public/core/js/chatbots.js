var socket = io.connect(root_path + '/ensoSocket', {
    reconnection: true,
    reconnectionDelay: 10000,
    reconnectionDelayMax: 50000,
    reconnectionAttempts: Infinity,
    path: '/enso/websocket/connector',
    transport: ['websocket']
});

socket.on('connect', function () {
    console.log("connected socket front")
});


$(document).ready(function () {
    console.log(root_path)

    $.fn.dataTable.ext.errMode = 'none';
    var UPDATE = '';
    var UPDATEPARAM = '';

    $('[data-toggle="tooltip"]').tooltip()
    var DT = $("#datatable").DataTable({
        "responsive": true,
        "data": {},
        "columns": [
            {
                "data": "_id"
            },
            {
                "data": "name"
            },
            {
                "data": "description"
            },
            {
                "data": "chatbot_type",
                render: function (data) {
                    return data.name
                }
            },
            {
                "data": "origin_chatbot",
                render: function (data) {
                    return data.name
                }
            },
            {
                "data": "google_auth"
            },
            {
                "data": "google_password"
            },
            {
                "data": "private_key"
            },
            {
                "data": "public_key"
            },
            {
                "data": "url"
            },
            {
                "data": "telegram_token",
                render: function (data, v, row) {
                    return '<span class="dtr-data" id="tel_' + row._id + '" value="' + data + '">' + data + '</span>'
                }
            },
            {
                "data": "facebook_recipient"
            },
            {
                "data": "webhook",
                render: function (data, v, row) {
                    return '<span class="dtr-data" id="web_' + row._id + '" value="' + data + '">' + data + '</span>'
                }

            },
            {
                "data": "name_collection_products"
            },
            {
                "data": "createdAt",
                render: function (data, v, row) {
                    return moment(data).format('DD/MM/YYYY h:mm:ss')
                }

            },
            {
                "data": "updatedAt",
                render: function (data, v, row) {
                    return moment(data).format('DD/MM/YYYY h:mm:ss')
                }
            },
            {
                data: "_id",
                render: function (data, v, row) {
                    return '<button value="' + data + '" class="btn btn-primary btn-block update_element" data-toggle="tooltip" data-placement="right" title="Edit " style="width: 300px"> <i class="fas fa-edit"></i></button>' +
                        '<button value="' + data + '" class="btn btn-danger btn-block delete_element" data-toggle="tooltip" data-placement="right" title="Delete " style="width: 300px"> <i class="fas fa-trash"></i></button>' +
                        '<button value="' + data + '" class="btn btn-success btn-block Conversations" data-toggle="tooltip" data-placement="right" title="Conversation " style="width: 300px"> <i class="fas fa-comments"></i></button>';
                        '<button value="' + data + '" class="btn btn-success btn-block Conversations" data-toggle="tooltip" data-placement="right" title="Conversation " style="width: 300px"> <i class="fas fa-comments"></i></button>';


                }
            }

        ],
        processing: true,
        serverSide: true,
        ajax: {
            url: root_path + 'app/api/chatbot/' + _app_id_ + '/datatable',
            type: "POST"
        },
    });
    draw_datatable_rs(DT);
    $("#in_chatboot_type").select2()
    $("#in_origin_chatboot").select2()
    $('.select2-selection').css("height", "40px")

    var name
    var origin = ""
    $.ajax({
        url: root_path + 'api/core/chatbotstype',
        method: 'GET',
    }).done(function (data) {
        console.log(data)
        let chatoptions = ""
        for (let item of data.data) {
            if (item.active) {
                chatoptions = chatoptions + '<option value="' + item._id + '" title="' + item.description + '">' + item.name + '</option>'
            }
        }
        $('#in_chatboot_type').append(chatoptions)
    })

    $.ajax({
        url: root_path + 'api/core/origin_chatbot',
        method: 'GET',
    }).done(function (data) {
        console.log(data)
        let chatoptions = ""
        for (let item of data.data) {
            if (item.active) {
                chatoptions = chatoptions + '<option value="' + item._id + '" id="origin_' + item._id + '" title="' + item.description + '" data="' + item.origin + '">' + item.name + '</option>'
            }
        }
        $('#in_origin_chatboot').append(chatoptions)
    })

    $('#btn_new_element').click(function () {
        $('#modal_new_edit').modal('show');
        $('#in_name').val('');
        $('#in_description').val('');
        $('#in_chatboot_type').val('');
        $('#in_origin_chatboot').val('');
        $('#in_google').val('');
        $('#in_google_pass').val('');
        $('#in_private').val('');
        $('#in_public').val('');
        $('#url').val('');
        $('#in_token').val('');
        $('#in_webhook').val('');
        $('#in_collection').val('');
        $('#in_facebook_recipent').val('');
        UPDATE = ''
    });

    $(document.body).on("change", "#in_chatboot_type", function () {
        $('#in_des_type').val($('#in_chatboot_type').select2('data')[0].title)
    })
    $(document).on("change", "#in_name", function () {
        name = $("#in_name").val()
        name = name.toLowerCase()
        name = name.replace(" ", "_").trim(" ")
        //$('#in_origin_chatboot').change()
        let id_sel = $('#in_origin_chatboot').select2('data')[0].id
        let num = $("#origin_" + id_sel).attr("data")

        switch (Number(num)) {
            case 1:
                origin = "facebook"
                break;
            case 2:
                origin = "telegram"
                break;
            case 3:
                origin = "web"
                break;
            case 4:
                origin = "other"
                break;
            default:
                origin = "telegram"
                break;
        }
        var URLactual = window.location.host;


        let url = "https://" + URLactual + "/enso/api/webhook/" + origin + "/" + name + "/"
        $('#in_webhook').val(url)

    })
    $(document.body).on("change", "#in_origin_chatboot", function () {
        $('#in_des_origin').val($('#in_origin_chatboot').select2('data')[0].title)

        let id_sel = $('#in_origin_chatboot').select2('data')[0].id
        let num = $("#origin_" + id_sel).attr("data")

        switch (Number(num)) {
            case 1:
                origin = "facebook"
                break;
            case 2:
                origin = "telegram"
                break;
            case 3:
                origin = "web"
                break;
            case 4:
                origin = "other"
                break;
            default:
                origin = "telegram"
                break;
        }
        var URLactual = window.location.host;

        $('#in_name').change()

        let url = window.location.protocol + "//" + URLactual + root_path + "app/api/webhook/" + origin + "/" + _app_id_ + "/" + name + "/"
        $('#in_webhook').val(url)
    })


    $("#save_changes").click(async function () {
        let body = {};

        body.name = $('#in_name').val();
        body.description = $('#in_description').val();
        body.chatbot_type = $('#in_chatboot_type').select2('data')[0].id;
        body.origin_chatbot = $('#in_origin_chatboot').select2('data')[0].id;
        body.google_auth = $('#in_google').val();
        body.google_password = $('#in_google_pass').val();
        body.private_key = $('#in_private').val();
        body.public_key = $('#in_public').val();
        body.url = $('#url').val();
        body.telegram_token = $('#in_token').val();
        body.webhook = $('#in_webhook').val();
        body.name_collection_products = $('#in_collection').val();
        body.facebook_recipient = $('#in_facebook_recipent').val();


        if (body.name === '') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }

        await save_data_api(root_path + 'app/api/chatbot/' + _app_id_, body, UPDATE, function (data) {
            draw_datatable_rs(DT);
            UPDATE = '';
            HoldOn.close();
            console.log("Chatbot guardado")
            notify_success(data.message);
            let token = $('#in_token').val();
            let webhook = $('#in_webhook').val()
            let setUrl = 'https://api.telegram.org/bot' + token + '/setWebhook'
            $.post(setUrl, {
                "url": webhook,
            }, function (data) {
                console.log(data)
            })
            $('#modal_new_edit').modal('hide');
            $('#btn_build_function').click()
        })
    })


    $(document.body).on('click', '.delete_element', function () {
        let DELETE = $(this).val();
        confirm_delete(function () {
            $.ajax({
                url: root_path + 'app/api/chatbot/' + _app_id_ + '/' + DELETE,
                method: 'DELETE',
            }).done(function (data) {
                HoldOn.close();
                notify_success(i18n.element_deleted)
                draw_datatable_rs(DT);
                DELETE = '';
            }).fail(function (err) {
                HoldOn.close();
                notify_error(err.responseJSON.message);
                console.error(err);
                DELETE = '';
            });
        });

    });


    $(document.body).on('click', '.update_element', async function () {
        UPDATE = $(this).val();
        try {

            let response = await fetch(root_path + 'app/api/chatbot/' + _app_id_ + '/' + UPDATE, {})
            let data = await response.json()

            console.log(data.data.chatbot_type._id)
            $('#modal_new_edit').modal('show');
            $('#in_name').val(data.data.name);
            $('#in_description').val(data.data.description);
            $('#in_chatboot_type').val(data.data.chatbot_type._id);
            $('#in_chatboot_type').trigger('change');
            $('#in_origin_chatboot').val(data.data.origin_chatbot._id);
            $('#in_origin_chatboot').trigger('change');
            $('#in_google').val(data.data.google_auth);
            $('#in_google_pass').val(data.data.google_password);
            $('#in_private').val(data.data.private_key);
            $('#in_public').val(data.data.public_key);
            $('#url').val(data.data.url);
            $('#in_token').val(data.data.telegram_token);
            $('#in_webhook').val(data.data.webhook);
            $('#in_collection').val(data.data.name_collection_products);
            $('#in_facebook_recipent').val(data.data.facebook_recipient);


            name = $("#in_name").val()
            name = name.toLowerCase()
            name = name.replace(" ", "_").trim(" ")
            console.log(data.data.origin_chatbot.origin)
            switch (data.data.origin_chatbot.origin) {
                case 1:
                    origin = "facebook"
                    break;
                case 2:
                    origin = "telegram"
                    break;
                case 3:
                    origin = "web"
                    break;
                case 4:
                    origin = "other"
                    break;
                default:
                    origin = "telegram"
                    break;
            }
            var URLactual = window.location.host;

            let url = "https://" + URLactual + "/enso/app/api/webhook/" + origin + "/" + _app_id_ + "/" + name + "/"
            $('#in_webhook').val(url)


        } catch (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        }

    });
    let Id_conv_list = '';
    let Id_conv_single = '';
    let CHAT_ID_ = '';
    let PLATFORM_ = '';

    var DT_conv_list = {};
    var Chat_list_ = {};

    $(document).on('click', '.Conversations', function () {
        let ID_conversation_list = $(this).val();

        $('#tab_conversaciones').removeClass('disabled');
        $('#tab_conversaciones').click();

        socket.emit('chat_list:get_all', ID_conversation_list);
        console.log(ID_conversation_list)
        Id_conv_list = ID_conversation_list;
        getConvList();

    });

    let getConvList = function () {

        HoldOn.open()
        if (Id_conv_list == "") {
            return 0;
        }

        if (!DT_conv_list[Id_conv_list]) {
            let nueva_tabla = $('#Template_table_list').clone();
            nueva_tabla.attr('id', 'tb_' + Id_conv_list);
            $('#spce4_table').html(nueva_tabla);

        } else {
            DT_conv_list[Id_conv_list].destroy();
            delete DT_conv_list[Id_conv_list]
            let nueva_tabla = $('#Template_table_list').clone();
            nueva_tabla.attr('id', 'tb_' + Id_conv_list);
            $('#spce4_table').html(nueva_tabla);

        }
        DT_conv_list[Id_conv_list] = $('#tb_' + Id_conv_list).DataTable({
            //language: DT_Lang,
            // responsive: true,
            scrollX: true,
            data: {},
            columns: [

                {
                    data: "_id",

                },
                {
                    data: "chat_id"
                },
                {
                    data: "origin_chatbot",
                    render: function (data, v, row) {
                        if (data == '6058bc38dd3a3c2e46dbe2a2') {
                            return '<span class="badge badge-warning"><i class="fas fa-robot fa-2x"></i><br> WEB</span>'
                        }
                        if (data == '6058bbb9dd3a3c2e46dbe2a1') {
                            return '<span class="badge badge-dark"><i class="fab fa-telegram fa-2x"></i><br> TELEGRAM</span>'
                        }
                        if (data == '6058bb97dd3a3c2e46dbe2a0') {
                            return '<span class="badge badge-info"><i class="fab fa-facebook-messenger fa-2x"></i><br>MESSENGER</span>'
                        }
                    }

                },
                {
                    data: "active_conv",
                    render: function (data) {
                        if (data) {
                            return '<span class="badge badge-success">YES/SI</span>'
                        } else {
                            return '<span class="badge badge-danger">NO</span>'
                        }
                    }

                },
                {
                    data: "dt_reg",

                },
                {
                    data: "last_message",

                },
                {
                    data: "last_time",
                    render: function (data) {
                        return moment().to(data)
                    }
                },
                {
                    data: "_id",

                    render: function (data, v, row) {
                        if (row.active_conv) {
                            return '<center>' +
                                '<button class=" DeactiveConversation btn btn-block btn-danger" value="' + data + '"><i class="fas fa-comment-slash"></i></button>' +
                                '<button platform="' + row.origin_chatbot + '" chat-id="' + row.chat_id + '" class=" TakeConversation btn btn-block btn-info" value="' + data + '"><i class="far fa-comment-dots"></i></i></button>'
                                + '</center>';
                        } else {
                            return '<center>' +
                                '<button platform="' + row.origin_chatbot + '" chat-id="' + row.chat_id + '" class=" TakeConversation btn btn-block btn-info" value="' + data + '"><i class="far fa-comment-dots"></i></i></button>' +
                                '<button platform="' + row.origin_chatbot + '" chat-id="' + row.chat_id + '" class=" SpyConversation btn btn-block btn-dark" value="' + data + '"><i class="fas fa-eye"></i></i></button>'
                                + '</center>';
                        }
                    }
                },

            ]
        });

        socket.on('chat_list_one:' + Id_conv_list, function (msg) {
            let data = JSON.parse(msg);
            DT_conv_list[Id_conv_list].clear().rows.add(data).draw();
            HoldOn.close();
        });
    };
    $.fn.scrollBottom = function() {
        return $(document).height() - this.scrollTop() - this.height();
    };

    let Id_conv_single_generico = '';
    let list_of_emit_chats = [];

    /*$(document.body).on('click', '.SpyConversation', function () {
        $('.type_msg').hide()
        Id_conv_single = $(this).val();
        CHAT_ID_ = $(this).attr('chat-id')
        PLATFORM_ = $(this).attr('platform')

        switch (PLATFORM_) {
            case "6058bbb9dd3a3c2e46dbe2a1":
                PLATFORM_ = "TELEGRAM"
                break
            case "6058bb97dd3a3c2e46dbe2a0":
                PLATFORM_ = "FACEBOOK"
                break
            case "6058bc38dd3a3c2e46dbe2a2":
                PLATFORM_ = "WEB"
                break
            case "6058bc54dd3a3c2e46dbe2a3":
                PLATFORM_ = "OTRO"
                break
        }

        $('#chatHere_').html('');

        $('.DeactiveConversation_close').attr('value', Id_conv_single);
        $('#tab_message').removeClass('disabled');
        $('#tab_conversaciones').addClass('disabled');
        $('#tab_message').click();

        let allmesagge = []
        let helper = []
        console.log(Id_conv_single)
        socket.emit('chat_spy:conversation', Id_conv_single);
        if (!list_of_emit_chats[Id_conv_single]) {

            socket.on('chat_talk_one:' + Id_conv_single, function (msg) {

                let data = JSON.parse(msg)
                console.log(data)
                if(data.chatlist_id == Id_conv_single){
                    if (data.who_says === 'external') {
                        if (data.isRich) {
                            switch (data.rich_kind) {
                                case 'sticker':
                                    allmesagge.push({ data: moment().calendar(data.dt_reg),id_chat: data.chat_id, id:data.message_id, html: '<div class="incoming_msg"><div class="received_withd_msg"><img class="img img-fluid" src="' + data.url + '"><span class="time_date">'+moment().to(data.dt_reg)+'</span></div></div>  <br>' , owner :true});
                                    break;
                                case 'animation':
                                    allmesagge.push({data: moment().calendar(data.dt_reg),id_chat: data.chat_id, id:data.message_id, html: '<div class="incoming_msg"><div class="received_withd_msg"><video width="150px" autoplay loop  controls> <source src="' + data.url + '" type="video/mp4"></video></div></div>', owner :true});
                                    break;
                                case 'document':
                                    allmesagge.push({data: moment().calendar(data.dt_reg),id_chat: data.chat_id, id:data.message_id, html: '<div class="incoming_msg"><div class="received_withd_msg"><a href="' + data.url + '" download=""> Archivo </a></div></div>', owner :true});
                                    break;
                                case 'voice':
                                    allmesagge.push({data: moment().calendar(data.dt_reg),id_chat: data.chat_id, id:data.message_id, html: '<div class="incoming_msg"><div class="received_withd_msg"><audio controls> <source src="' + data.url + '" type="audio/ogg"></audio></div></div>', owner :true});
                                    break;
                                case 'photo':
                                    allmesagge.push({data: moment().calendar(data.dt_reg),id_chat: data.chat_id,id:data.message_id,  html: '<div class="incoming_msg"><div class="received_withd_msg"><img class="img img-fluid" style="height: 350px" src="' + data.url + '"><span class="time_date">'+moment().to(data.dt_reg)+'</span></div></div> <br>' + (data.text ? data.text : ''), owner :true});
                                    break;
                            }
                        } else {
                            allmesagge.push({date:moment().calendar(data.dt_reg), id_chat: data.chat_id,id:data.message_id, html:'<div class="incoming_msg"><div class="received_withd_msg"><p>'+data.text+'</p><span class="time_date">'+moment().to(data.dt_reg)+'</span></div></div>', owner: true});
                        }

                    }else{
                        allmesagge.push({date:moment().calendar(data.dt_reg), id_chat: data.chat_id,id:data.message_id, html:'<div class="outgoing_msg"><div class="sent_msg"><p>'+data.text+'</p><span class="time_date">'+moment().to(data.dt_reg)+'</span></div></div>', owner: true});
                    }
                    console.log(helper.find(ele => ele == data.message_id))
                    for(let item of allmesagge){

                        if(!helper.find(ele => ele == item.id)){
                            helper.push(item.id)
                            $('#history').append(item.html)

                        }
                    }

                    $('.incoming_msg').height($('.incoming_msg').children().height())
                    var elmnt = document.getElementById("history");
                    let y = elmnt.scrollHeight

                    $('#history').scrollTop(y);
                }

            })

        }


    })*/
    var contConversations = []

    $(document.body).on('click', '.SpyConversation', function () {
        $('.type_msg').hide()
        Id_conv_single = $(this).val();
        CHAT_ID_ = $(this).attr('chat-id')
        PLATFORM_ = $(this).attr('platform')

        switch (PLATFORM_) {
            case "6058bbb9dd3a3c2e46dbe2a1":
                PLATFORM_ = "TELEGRAM"
                break
            case "6058bb97dd3a3c2e46dbe2a0":
                PLATFORM_ = "FACEBOOK"
                break
            case "6058bc38dd3a3c2e46dbe2a2":
                PLATFORM_ = "WEB"
                break
            case "6058bc54dd3a3c2e46dbe2a3":
                PLATFORM_ = "OTRO"
                break
        }

        $('#history').html('');

        $('.DeactiveConversation_close').attr('value', Id_conv_single);
        $('#tab_message').removeClass('disabled');
        $('#tab_conversaciones').addClass('disabled');
        $('#tab_message').click();

        let allmesagge = {}


        let convExist = contConversations.filter(ele=> ele==Id_conv_single)
        console.log(convExist.length)
        socket.emit('chat_spy:conversation', Id_conv_single);
        if (convExist.length<1) {
            contConversations.push(Id_conv_single)

            socket.on('chat_talk_one:' + Id_conv_single, function (msg) {

                let data = JSON.parse(msg)
                if(data.chatlist_id == Id_conv_single){
                    if (data.who_says === 'external') {
                        if (data.isRich) {
                            switch (data.rich_kind) {
                                case 'sticker':
                                    allmesagge = { data: moment().calendar(data.dt_reg),id_chat: data.chat_id, id:data.message_id, html: '<div class="incoming_msg"><div class="received_withd_msg"><img class="img img-fluid"  style="height: 100px" src="' + data.url + '"><span class="time_date">'+moment().to(data.dt_reg)+'</span></div></div>  <br>' , owner :true};
                                    break;
                                case 'animation':
                                    allmesagge = {data: moment().calendar(data.dt_reg),id_chat: data.chat_id, id:data.message_id, html: '<div class="incoming_msg"><div class="received_withd_msg"><video width="150px" autoplay loop  controls> <source src="' + data.url + '" type="video/mp4"></video></div></div>', owner :true};
                                    break;
                                case 'document':
                                    allmesagge = {data: moment().calendar(data.dt_reg),id_chat: data.chat_id, id:data.message_id, html: '<div class="incoming_msg"><div class="received_withd_msg"><a href="' + data.url + '" download=""> Archivo </a></div></div>', owner :true};
                                    break;
                                case 'voice':
                                    allmesagge = {data: moment().calendar(data.dt_reg),id_chat: data.chat_id, id:data.message_id, html: '<div class="incoming_msg"><div class="received_withd_msg"><audio controls> <source src="' + data.url + '" type="audio/ogg"></audio></div></div>', owner :true};
                                    break;
                                case 'photo':
                                    allmesagge = {data: moment().calendar(data.dt_reg),id_chat: data.chat_id,id:data.message_id,  html: '<div class="incoming_msg"><div class="received_withd_msg"><img class="img img-fluid" style="height: 350px" src="' + data.url + '"><span class="time_date">'+moment().to(data.dt_reg)+'</span></div></div> <br>', owner :true};
                                    break;
                            }
                        } else {
                            allmesagge = {date:moment().calendar(data.dt_reg), id_chat: data.chat_id,id:data.message_id, html:'<div class="incoming_msg"><div class="received_withd_msg"><p>'+data.text+'</p><span class="time_date">'+moment().to(data.dt_reg)+'</span></div></div>', owner: true};
                        }

                    }else{
                        allmesagge = {date:moment().calendar(data.dt_reg), id_chat: data.chat_id,id:data.message_id, html:'<div class="outgoing_msg"><div class="sent_msg"><p>'+data.text+'</p><span class="time_date">'+moment().to(data.dt_reg)+'</span></div></div>', owner: true};
                    }
                    $('#history').append(allmesagge.html)

                    $('.incoming_msg').height($('.incoming_msg').children().height())
                    var elmnt = document.getElementById("history");
                    let y = elmnt.scrollHeight

                    $('#history').scrollTop(y);
                    console.log(contConversations)
                }

            })

        }



    })

    /*$(document.body).on('click', '.TakeConversation', function () {
        $('.type_msg').show()

        Id_conv_single = $(this).val();
        CHAT_ID_ = $(this).attr('chat-id')
        PLATFORM_ = $(this).attr('platform')

        $('#chatHere_').html('');
        $('#history').html("");
        $(' .type_msg').html("");
        switch (PLATFORM_) {
            case "6058bbb9dd3a3c2e46dbe2a1":
                PLATFORM_ = "TELEGRAM"
                break
            case "6058bb97dd3a3c2e46dbe2a0":
                PLATFORM_ = "FACEBOOK"
                break
            case "6058bc38dd3a3c2e46dbe2a2":
                PLATFORM_ = "WEB"
                break
            case "6058bc54dd3a3c2e46dbe2a3":
                PLATFORM_ = "OTRO"
                break
        }


        $(' .type_msg').append('<div class="container-send"><div class="input_msg_write"><input class="write_msg" type="text" placeholder="Type a message"><button class="msg_send_btn" value="'+Id_conv_single+'" id="ChatSendBUtton_"+Id_conv_single>' +
            '<i class="fas fa-paper-plane" aria-hidden="true"></i> Send</button></div></div>')

        $('.DeactiveConversation_close').attr('value', Id_conv_single);
        $('#tab_message').removeClass('disabled');
        $('#tab_conversaciones').addClass('disabled');
        $('#tab_message').click();

        let allmesagge = []
        let helper = []
        socket.emit('chat_speak:conversation', Id_conv_single);
        if (!list_of_emit_chats[Id_conv_single]) {
            socket.on('chat_talk_one:' + Id_conv_single, function (msg) {

                let data = JSON.parse(msg)

                if (data.who_says === 'external') {
                    if (data.isRich) {
                        switch (data.rich_kind) {
                            case 'sticker':
                                allmesagge.push({ data: moment().calendar(data.dt_reg),id_chat: data.chat_id, id:data.message_id, html: '<div class="incoming_msg"><div class="received_withd_msg"><img class="img img-fluid" src="' + data.url + '"><span class="time_date">'+moment().to(data.dt_reg)+'</span></div></div>  <br>' , owner :true});
                                break;
                            case 'animation':
                                allmesagge.push({data: moment().calendar(data.dt_reg),id_chat: data.chat_id, id:data.message_id, html: '<div class="incoming_msg"><div class="received_withd_msg"><video width="150px" autoplay loop  controls> <source src="' + data.url + '" type="video/mp4"></video></div></div>', owner :true});
                                break;
                            case 'document':
                                allmesagge.push({data: moment().calendar(data.dt_reg),id_chat: data.chat_id, id:data.message_id, html: '<div class="incoming_msg"><div class="received_withd_msg"><a href="' + data.url + '" download=""> Archivo </a></div></div>', owner :true});
                                break;
                            case 'voice':
                                allmesagge.push({data: moment().calendar(data.dt_reg),id_chat: data.chat_id, id:data.message_id, html: '<div class="incoming_msg"><div class="received_withd_msg"><audio controls> <source src="' + data.url + '" type="audio/ogg"></audio></div></div>', owner :true});
                                break;
                            case 'photo':
                                allmesagge.push({data: moment().calendar(data.dt_reg),id_chat: data.chat_id,id:data.message_id,  html: '<div class="incoming_msg"><div class="received_withd_msg"><img class="img img-fluid" style="height: 350px" src="' + data.url + '"><span class="time_date">'+moment().to(data.dt_reg)+'</span></div></div> <br>' + (data.text ? data.text : ''), owner :true});
                                break;
                        }
                    } else {
                        allmesagge.push({date:moment().calendar(data.dt_reg), id_chat: data.chat_id,id:data.message_id, html:'<div class="incoming_msg"><div class="received_withd_msg"><p>'+data.text+'</p><span class="time_date">'+moment().to(data.dt_reg)+'</span></div></div>', owner: true});
                    }

                }else{
                    allmesagge.push({date:moment().calendar(data.dt_reg), id_chat: data.chat_id,id:data.message_id, html:'<div class="outgoing_msg"><div class="sent_msg"><p>'+data.text+'</p><span class="time_date">'+moment().to(data.dt_reg)+'</span></div></div>', owner: true});
                }

                for(let item of allmesagge){

                    if(!helper.find(ele => ele == item.id)){
                        helper.push(item.id)
                        $('#history').append(item.html)

                    }
                }
                $('.incoming_msg').height($('.incoming_msg').children().height())
                var elmnt = document.getElementById("history");
                let y = elmnt.scrollHeight

                $('#history').scrollTop(y);

            })

        }

    })*/

    $(document.body).on('click', '.TakeConversation', function () {
        $('.type_msg').show()

        Id_conv_single = $(this).val();
        CHAT_ID_ = $(this).attr('chat-id')
        PLATFORM_ = $(this).attr('platform')

        $('#chatHere_').html('');
        $('#history').html("");
        $(' .type_msg').html("");
        switch (PLATFORM_) {
            case "6058bbb9dd3a3c2e46dbe2a1":
                PLATFORM_ = "TELEGRAM"
                break
            case "6058bb97dd3a3c2e46dbe2a0":
                PLATFORM_ = "FACEBOOK"
                break
            case "6058bc38dd3a3c2e46dbe2a2":
                PLATFORM_ = "WEB"
                break
            case "6058bc54dd3a3c2e46dbe2a3":
                PLATFORM_ = "OTRO"
                break
        }


        $(' .type_msg').append('<div class="container-send"><div class="input_msg_write"><input class="write_msg" type="text" placeholder="Type a message"><button class="msg_send_btn" value="'+Id_conv_single+'" id="ChatSendBUtton_"+Id_conv_single>' +
            '<i class="fas fa-paper-plane" aria-hidden="true"></i> Send</button></div></div>')

        $('.DeactiveConversation_close').attr('value', Id_conv_single);
        $('#tab_message').removeClass('disabled');
        $('#tab_conversaciones').addClass('disabled');
        $('#tab_message').click();

        let allmesagge = []


        let convExist = contConversations.filter(ele=> ele==Id_conv_single)
        console.log(convExist.length)
        socket.emit('chat_speak:conversation', Id_conv_single);
        if (convExist.length<1) {
            contConversations.push(Id_conv_single)

            socket.on('chat_talk_one:' + Id_conv_single, function (msg) {

                let data = JSON.parse(msg)
                if(data.chatlist_id == Id_conv_single){
                    if (data.who_says === 'external') {
                        if (data.isRich) {
                            switch (data.rich_kind) {
                                case 'sticker':
                                    allmesagge = { data: moment().calendar(data.dt_reg),id_chat: data.chat_id, id:data.message_id, html: '<div class="incoming_msg"><div class="received_withd_msg"><img class="img img-fluid" src="' + data.url + '"><span class="time_date">'+moment().to(data.dt_reg)+'</span></div></div>  <br>' , owner :true};
                                    break;
                                case 'animation':
                                    allmesagge = {data: moment().calendar(data.dt_reg),id_chat: data.chat_id, id:data.message_id, html: '<div class="incoming_msg"><div class="received_withd_msg"><video width="150px" autoplay loop  controls> <source src="' + data.url + '" type="video/mp4"></video></div></div>', owner :true};
                                    break;
                                case 'document':
                                    allmesagge = {data: moment().calendar(data.dt_reg),id_chat: data.chat_id, id:data.message_id, html: '<div class="incoming_msg"><div class="received_withd_msg"><a href="' + data.url + '" download=""> Archivo </a></div></div>', owner :true};
                                    break;
                                case 'voice':
                                    allmesagge = {data: moment().calendar(data.dt_reg),id_chat: data.chat_id, id:data.message_id, html: '<div class="incoming_msg"><div class="received_withd_msg"><audio controls> <source src="' + data.url + '" type="audio/ogg"></audio></div></div>', owner :true};
                                    break;
                                case 'photo':
                                    allmesagge = {data: moment().calendar(data.dt_reg),id_chat: data.chat_id,id:data.message_id,  html: '<div class="incoming_msg"><div class="received_withd_msg"><img class="img img-fluid" style="height: 350px" src="' + data.url + '"><span class="time_date">'+moment().to(data.dt_reg)+'</span></div></div> <br>', owner :true};
                                    break;
                            }
                        } else {
                            allmesagge = {date:moment().calendar(data.dt_reg), id_chat: data.chat_id,id:data.message_id, html:'<div class="incoming_msg"><div class="received_withd_msg"><p>'+data.text+'</p><span class="time_date">'+moment().to(data.dt_reg)+'</span></div></div>', owner: true};
                        }

                    }else{
                        allmesagge = {date:moment().calendar(data.dt_reg), id_chat: data.chat_id,id:data.message_id, html:'<div class="outgoing_msg"><div class="sent_msg"><p>'+data.text+'</p><span class="time_date">'+moment().to(data.dt_reg)+'</span></div></div>', owner: true};
                    }
                    $('#history').append(allmesagge.html)

                    $('.incoming_msg').height($('.incoming_msg').children().height())
                    var elmnt = document.getElementById("history");
                    let y = elmnt.scrollHeight

                    $('#history').scrollTop(y);
                    console.log(contConversations)
                }

            })

        }

    })

    $(document.body).on('click', '.msg_send_btn', function () {
        let texto = $('.write_msg').val();
         $('.write_msg').val("");
        let chat = $(this).val()
        if (!texto || texto.trim() == '') {
            return 0;
        }

        let nuevo = {
            text: texto,
            chat: chat,
            app: _app_id_
        }
        socket.emit('chat_talk:send', JSON.stringify(nuevo))
    });
    
    $('.DeactiveConversation_close').click(function () {
        Id_conv_single = $(this).val();
        socket.emit('chat_talk:deactive_conversation', Id_conv_single);
        $('#tab_message').addClass("disabled")
        $('#tab_tables').click()
    })
    /*Chat_list_[Id_conv_single_generico] = new chat_dasflow('#chatHere_');
    console.log( Chat_list_[Id_conv_single_generico])
    Chat_list_[Id_conv_single_generico].sendFunction = function (text) {
        socket.emit('chat_talk_one:send', JSON.stringify({
            chatlist_id: Id_conv_single,
            chat_id: CHAT_ID_,
            text: text,
            who_says: 'me',
            platform: PLATFORM_,
            dt_reg: moment().format()
        }));
    }


    Chat_list_[Id_conv_single_generico].inicialize('CHAT ' + Id_conv_single, 'DashFlow');

    Chat_list_[Id_conv_single_generico].deactiveSend();

    $('#Content_').removeClass('disabled');
    $('#Structure_').addClass('disabled');
    $('#Content_').click();

    socket.emit('chat_spy:conversation', Id_conv_single);

    if (!list_of_emit_chats[Id_conv_single]) {
        list_of_emit_chats[Id_conv_single] = true;
        socket.on('chat_talk_one:' + Id_conv_single, function (msg) {
            let data = JSON.parse(msg);

            console.info('************************************** _  Spy');
            console.info(data);

            if (data.who_says === 'external') {


                if (data.isRich) {
                    switch (data.rich_kind) {
                        case 'sticker':
                            Chat_list_[Id_conv_single_generico].pushMessaje(moment().to(data.dt_reg), data.chat_id, '<img class="img img-fluid" src="' + data.url + '"> <br>' + data.text, true);
                            break;
                        case 'animation':
                            Chat_list_[Id_conv_single_generico].pushMessaje(moment().to(data.dt_reg), data.chat_id, '<video width="150px" autoplay loop  controls> <source src="' + data.url + '" type="video/mp4"></video>', true);
                            break;
                        case 'document':
                            Chat_list_[Id_conv_single_generico].pushMessaje(moment().to(data.dt_reg), data.chat_id, '<a href="' + data.url + '" download=""> Archivo </a>', true);
                            break;
                        case 'voice':
                            Chat_list_[Id_conv_single_generico].pushMessaje(moment().to(data.dt_reg), data.chat_id, '<audio controls> <source src="' + data.url + '" type="audio/ogg"></audio>', true);
                            break;
                        case 'photo':
                            Chat_list_[Id_conv_single_generico].pushMessaje(moment().to(data.dt_reg), data.chat_id, '<img class="img img-fluid" src="' + data.url + '"> <br>' + (data.text ? data.text : ''), true);
                            break;
                    }

                } else {
                    Chat_list_[Id_conv_single_generico].pushMessaje(moment().to(data.dt_reg), data.chat_id, data.text, true);
                }

            } else {
                if (data.text == '') {

                    let elemJson = JSON.parse(data.full_json);
                    if (elemJson.queryResult && elemJson.queryResult.fulfillmentMessages && elemJson.queryResult.fulfillmentMessages.length > 0) {

                        elemJson.queryResult.fulfillmentMessages.map(function (item, i) {
                            if (item.message == 'card') {

                                let NewKey = makeid(7)


                                let cad = '<div class="card border-primary mb-3" "> ' +
                                    '<div class="card-header"><center><h3>' + item.card.title + '</h3></center></div> ' +
                                    '<div class="card-body"> ' +
                                    '<h4 class="card-title"><center>' + item.card.subtitle + '</center></h4> ' +
                                    '<center><img class="img-fluid img-thumbnail " src="' + item.card.imageUri + '" alt="Card image"></center>' +
                                    '<div class="row" id="SP_buttons_' + NewKey + '"></div>' +
                                    '</div> ' +
                                    '</div>';


                                Chat_list_[Id_conv_single_generico].pushMessaje(moment().to(data.dt_reg), 'DashFlow', cad, false);


                                item.card.buttons.map(function (jtem, j) {
                                    let btnID = makeid(17);
                                    let buttons = '<div class="col-6"><button class="btn btn-sm btn-primary btn-block" postbak="' + jtem.postback + '" id="' + btnID + '_MYbtn_' + i + j + '">' + jtem.text + '</button></div>';
                                    $('#SP_buttons_' + NewKey).append(buttons)

                                    $('#' + btnID + '_MYbtn_' + i + j).click(function () {

                                        let value = $('#' + btnID + '_MYbtn_' + i + j).attr('postbak');
                                        if (value.includes('http')) {
                                            window.open(value)
                                        } else {
                                            MyChat.sendFunction(value);
                                            MyChat.pushMessaje(moment().to(moment()), 'ME', value, false);
                                        }


                                    });
                                });

                            }

                            if (item.message == 'image') {

                                var cad = '<center><a href="' + item.image.imageUri + '" target="_blank"><img class="img-fluid img-thumbnail" alt="' + item.image.accessibilityText + '" src="' + item.image.imageUri + '"> </a></center>'

                                Chat_list_[Id_conv_single_generico].pushMessaje(moment().to(data.dt_reg), 'DashFlow', cad, false);


                            }
                            if (item.message == 'text' && item.text && item.text.text.length > 0) {
                                item.text.text.map(function (ntem, n) {
                                    Chat_list_[Id_conv_single_generico].pushMessaje(moment().to(data.dt_reg), 'DashFlow', ntem, false);
                                })

                            }
                            if (item.message == 'quickReplies') {
                                let NewKey = makeid(37)


                                let cad = '<div class="card border-primary mb-3" "> ' +
                                    '<div class="card-header"><center><h4>' + '</h4></center></div> ' +
                                    '<div class="card-body"> ' +
                                    '<div class="row" id="SP_buttons_' + NewKey + '"></div>' +
                                    '</div> ' +
                                    '</div>';


                                Chat_list_[Id_conv_single_generico].pushMessaje(moment().to(data.dt_reg), 'DashFlow', cad, false);


                                item.quickReplies.quickReplies.map(function (jtem, j) {
                                    let btnID = makeid(17);
                                    let buttons = '<div class="col-6"><button class="btn btn-sm btn-primary btn-block" postbak="' + jtem + '" id="' + btnID + '_MYbtn_' + i + j + '">' + jtem + '</button></div>';
                                    $('#SP_buttons_' + NewKey).append(buttons)

                                    $('#' + btnID + '_MYbtn_' + i + j).click(function () {

                                        let value = $('#' + btnID + '_MYbtn_' + i + j).attr('postbak');
                                        if (value.includes('http')) {
                                            window.open(value)
                                        } else {
                                            MyChat.sendFunction(value);
                                            MyChat.pushMessaje(moment().to(moment()), 'ME', value, false);
                                        }
                                    });
                                });

                            }

                        });
                    }
                } else {
                    Chat_list_[Id_conv_single_generico].pushMessaje(moment().to(data.dt_reg), 'DashFlow', data.text, false);
                }
            }
        });
    }*/
});

