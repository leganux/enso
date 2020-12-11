$(document).ready(function () {
    $.fn.dataTable.ext.errMode = 'none';
    var UPDATE = '';

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
                "data": "url"
            },
            {
                "data": "urltwo"
            },
            {
                "data": "urlthree"
            },
            {
                "data": "method"
            },
            {
                "data": "params"
            },
            {
                "data": "params",
                render: function (data, v, row) {
                    if (data) {
                        return data.name
                    }
                }
            },
            {
                "data": "params",
                render: function (data, v, row) {
                    if (data) {
                        return data.description
                    }
                }
            },
            {
                "data": "params",
                render: function (data, v, row) {
                    if (data) {
                        return data.format
                    }
                }
            },
            {
                "data": "params",
                render: function (data, v, row) {
                    if (data) {
                        return data.default
                    }
                }
            },
            {
                "data": "params",
                render: function (data, v, row) {
                    if (data) {
                        return data.paramtype
                    }
                }
            },
            {
                "data": "params",
                render: function (data, v, row) {
                    if (data) {
                        return data.paramtype.name
                    }
                }
            },
            {
                "data": "params",
                render: function (data, v, row) {
                    if (data) {
                        return data.paramtype.description
                    }
                }
            },
            {
                "data": "params",
                render: function (data, v, row) {
                    if (data) {
                        return data.paramtype.key
                    }
                }
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
                    return '<button value="' + data + '" class="btn btn-dark btn-block update_element"> <i class="fas fa-edit"></i></button>' +
                        '<button value="' + data + '" class="btn btn-danger btn-block delete_element"> <i class="fas fa-trash"></i></button>';


                }
            }

        ],
        processing: true,
        serverSide: true,
        ajax: {
            url: root_path + 'app/api/webservice/' + _app_id_ + '/datatable',
            type: "POST"
        },
    });
    draw_datatable_rs(DT);
    $("#in_method").select2()
    $("#in_format").select2()
    $('.select2-selection').css("height", "40px")

    $('#btn_new_element').click(function () {
        $('#modal_new_edit').modal('show');
        $('#in_name').val('');
        $('#in_description').val('');
        $('#in_url').val('');
        $('#in_url2').val('');
        $('#in_url3').val('');
        $('#in_param_name').val('');
        $('#in_param_description').val('');
        $('#in_param_default').val('');
        $('#in_type_name').val('');
        $('#in_type_description').val('');
        $('#in_type_key').val('');
        $('#in_method').val("non")
        $('#in_method').trigger("change")
        $('#in_format').val("non")
        $('#in_format').trigger("change")
        UPDATE = ''
    });

    

    $("#save_changes").click(async function () {
        let body = {};
        let param = {};
        let type = {};

        body.name = $('#in_name').val();
        body.description = $('#in_description').val();
        body.url = $('#in_url').val();
        body.urltwo = $('#in_url2').val();
        body.urlthree = $('#in_url3').val();
        body.method = $('#in_method').select2('data')[0].id

        param.name = $('#in_param_name').val();
        param.description = $('#in_param_description').val();
        param.format = $('#in_format').select2('data')[0].id
        param.default = $('#in_param_default').val();

        type.name = $('#in_type_name').val();
        type.description = $('#in_type_description').val();
        type.key = $('#in_type_key').val();

        param.paramtype = type
        body.params = param

        if (body.name === '') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }

        await save_data_api(root_path + 'app/api/webservice/' + _app_id_, body, UPDATE, function () {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_new_edit').modal('hide');
            $('#btn_build_function').click()
            HoldOn.close();
            console.log("webservice guardado")
            notify_success(data.message);
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);

        });;


    })


})