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
                "data": "chatbot_type"
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
                    return '<button value="' + data + '" class="btn btn-warning btn-block play_element  data-toggle="tooltip" data-placement="right" title="Execute webservice"> <i class="fas fa-play"></i></button>' +
                        '<button value="' + data + '" class="btn btn-success btn-block btn_new_param" data-toggle="tooltip" data-placement="right" title="New param"> <i class="fas fa-swatchbook"></i></button>' +
                        '<button value="' + data + '" class="btn btn-primary btn-block update_element" data-toggle="tooltip" data-placement="right" title="Edit webservice"> <i class="fas fa-edit"></i></button>' +
                        '<button value="' + data + '" class="btn btn-danger btn-block delete_element" data-toggle="tooltip" data-placement="right" title="Delete webservice"> <i class="fas fa-trash"></i></button>';


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
    $('.select2-selection').css("height", "40px")


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

    $('#btn_new_element').click(function () {
        $('#modal_new_edit').modal('show');
        $('#in_name').val('');
        $('#in_description').val('');
        $('#in_chatboot_type').val('');
        $('#in_google').val('');
        $('#in_google_pass').val('');
        $('#n_private').val('');
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

    $("#save_changes").click(async function () {
        let body = {};

        body.name = $('#in_name').val('');
        body.description = $('#in_description').val('');
        body.chatbot_type =$('#in_chatboot_type').select2('data')[0].id;
        body.google_auth =$('#in_google').val('');
        body.google_password = $('#in_google_pass').val('');
        body.private_key =$('#n_private').val('');
        body.public_key =$('#in_public').val('');
        body.url = $('#url').val('');
        body.telegram_token = $('#in_token').val('');
        body.webhook = $('#in_webhook').val('');
        body.name_collection_products = $('#in_collection').val('');


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

        });;


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

            console.log(data.data)
            $('#modal_new_edit').modal('show');
            $('#in_name').val(data.data.name);
            $('#in_description').val(data.data.description);
            $('#in_url').val(data.data.url);
            $('#in_url2').val(data.data.urltwo);
            $('#in_url3').val(data.data.urlthree);

            $('#in_method').val(data.data.method)
            $('#in_method').trigger("change")


        } catch (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        }


    });

})