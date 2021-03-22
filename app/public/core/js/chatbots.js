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
                "data": "telegram_token"
            },
            {
                "data": "webhook"
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
                    return '<button value="' + data + '" class="btn btn-primary btn-block update_element" data-toggle="tooltip" data-placement="right" title="Edit "> <i class="fas fa-edit"></i></button>' +
                        '<button value="' + data + '" class="btn btn-danger btn-block delete_element" data-toggle="tooltip" data-placement="right" title="Delete "> <i class="fas fa-trash"></i></button>'+
                        '<button value="' + data + '" class="btn btn-success btn-block Conversations" data-toggle="tooltip" data-placement="right" title="Conversation "> <i class="fas fa-comments"></i></button>';


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
        for (let item of data.data){
            if(item.active){
                chatoptions = chatoptions + '<option value="'+item._id+'" title="'+item.description+'">'+item.name+'</option>'
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
        for (let item of data.data){
            if(item.active){
                chatoptions = chatoptions + '<option value="'+item._id+'" id="origin_'+item._id+'" title="'+item.description+'" data="'+item.origin+'">'+item.name+'</option>'
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
        UPDATE = ''
    });

    $(document.body).on("change","#in_chatboot_type",function () {
        $('#in_des_type').val($('#in_chatboot_type').select2('data')[0].title)
    })
    $(document).on("change","#in_name",function () {
        name = $("#in_name").val()
        name = name.toLowerCase()
        name = name.replace(" ","_").trim(" ")
        //$('#in_origin_chatboot').change()
        let id_sel = $('#in_origin_chatboot').select2('data')[0].id
        let num = $("#origin_"+id_sel).attr("data")

        switch (Number(num)){
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


        let url = "https://"+URLactual+"/enso/api/webhook/"+origin+"/"+name+"/"
        $('#in_webhook').val(url)

    })
    $(document.body).on("change","#in_origin_chatboot",function () {
        $('#in_des_origin').val($('#in_origin_chatboot').select2('data')[0].title)

        let id_sel = $('#in_origin_chatboot').select2('data')[0].id
        let num = $("#origin_"+id_sel).attr("data")

        switch (Number(num)){
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

        let url = "https://"+URLactual+"/enso/api/webhook/"+origin+"/"+name+"/"
        $('#in_webhook').val(url)
    })


    $("#save_changes").click(async function () {
        let body = {};

        body.name = $('#in_name').val();
        body.description = $('#in_description').val();
        body.chatbot_type =$('#in_chatboot_type').select2('data')[0].id;
        body.origin_chatbot =$('#in_origin_chatboot').select2('data')[0].id;
        body.google_auth =$('#in_google').val();
        body.google_password = $('#in_google_pass').val();
        body.private_key =$('#in_private').val();
        body.public_key =$('#in_public').val();
        body.url = $('#url').val();
        body.telegram_token = $('#in_token').val();
        body.webhook = $('#in_webhook').val();
        body.name_collection_products = $('#in_collection').val();


        if (body.name === '') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }

        await save_data_api(root_path + 'app/api/chatbot/' + _app_id_, body, UPDATE, function (data) {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_new_edit').modal('hide');
            $('#btn_build_function').click()
            HoldOn.close();
            console.log("Chatbot guardado")
            notify_success(data.message);
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);

        });


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


            name = $("#in_name").val()
            name = name.toLowerCase()
            name = name.replace(" ","_").trim(" ")
            console.log(data.data.origin_chatbot.origin)
            switch (data.data.origin_chatbot.origin){
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

            let url = "https://"+URLactual+"/enso/api/webhook/"+origin+"/"+name+"/"
            $('#in_webhook').val(url)


        } catch (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        }

    });

    $(document).on('click', '.Conversations', function () {
        let ID_conversation_list = $(this).val();
        $('#Structure_').removeClass('disabled');
        $('#Structure_').click();
        socket.emit('chat_list:get_all', ID_conversation_list);
        Id_conv_list = ID_conversation_list;
        //getConvList();
    });

})