$(document).ready(function () {
    $.fn.dataTable.ext.errMode = 'none';
    var UPDATE = '';
    var UPDATEPARAM = '';

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
                "data": "params",
                render: function (data, v, row) {
                    if (data) {
                        let ides = data.map((item, i) => {
                            return " <br> " + i18n.param + " : "  + item._id + " <br> " + i18n.name + " : " + item.name +  " <br> " + i18n.description + " : " + item.description + " <br> " + i18n.format + " : " + item.format +
                                " <br> " + i18n.default + " : " + item.default +  " <br> " + i18n.type + " : " + item.paramtype.type +  " <br> " + i18n.name + " : " + item.paramtype.name + " <br> " + i18n.description + " : " + item.paramtype.description +
                                " <br> " + i18n.key + " : " + item.paramtype.key +
                                '<button style="max-width:80%" value="' + item._id + '" class="btn btn-primary btn-block btn_edit_param"> <i class="fas fa-pen-square"></i></button>'+
                                '<button style="max-width:80%" value="' + item._id + '" class="btn btn-danger btn-block btn_delete_param"> <i class="fas fa-trash"></i></button>';
                               
                        })
                        return ides.join(" ")
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
                    return '<button value="' + data + '" class="btn btn-warning btn-block play_element"> <i class="fas fa-play"></i></button>' +
                        '<button value="' + data + '" class="btn btn-success btn-block btn_new_param"> <i class="fas fa-swatchbook"></i></button>' +
                        '<button value="' + data + '" class="btn btn-primary btn-block update_element"> <i class="fas fa-edit"></i></button>' +
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
    $("#in_type").select2()
    $("#in_type_edit").select2()
    $("#in_format_edit").select2()
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


    $(document.body).on('click', '.btn_new_param', function () {
        let value = $(this).val()
        $('#modal_new_param').modal('show');
        $('#in_webservice ').val(value);
        $('#in_param_name').val('');
        $('#in_param_description').val('');
        $('#in_param_default').val('');
        $('#in_type_name').val('');
        $('#in_type_description').val('');
        $('#in_type_key').val('');
        $('#in_format').val("non")
        $('#in_format').trigger("change")
        
        UPDATE = ''

    });


    $("#save_changes").click(async function () {
        let body = {};

        body.name = $('#in_name').val();
        body.description = $('#in_description').val();
        body.url = $('#in_url').val();
        body.urltwo = $('#in_url2').val();
        body.urlthree = $('#in_url3').val();
        body.method = $('#in_method').select2('data')[0].id

        if (body.name === '') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }

        await save_data_api(root_path + 'app/api/webservice/' + _app_id_, body, UPDATE, function (data) {
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
    $("#save_changes_params").click(async function () {
        let body = {};
        let params = {};
        let type = {};

        body.id = $('#in_webservice').val();

        params.name = $('#in_param_name').val();
        params.description = $('#in_param_description').val();
        params.format = $('#in_format').select2('data')[0].id
        params.default = $('#in_param_default').val();

        type.name = $('#in_type_name').val();
        type.description = $('#in_type.description').val();
        type.key = $('#in_type_key').val();

        params.paramtype = type
        body.params = params

        if (params.name === '') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }



        save_data_api(root_path + 'app/api/webservice/params/' + _app_id_, body, UPDATE, function (data) {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_new_param').modal('hide');
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

    async function getypes(){

        /**
         * TODO: revisar las rutas params_type debido a error 404 
         * TODO: Arreglar Crud con rutas de type
         */
        let response = await fetch(root_path + 'api/core/params_type', {})
        let data = await response.json()

        console.log(data)
    }

    getypes()

    $("#add_params").click(async function () { 
        let body = {}

        body.key = $('#in_add_key').val();
        body.name = $('#in_add_name').val();
        body.description = $('#in_add_description').val();

        save_data_api(root_path + 'app/api/params_type/' + _app_id_, body, UPDATE, function (data) {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_edit_param').modal('hide');
            $('#btn_build_function').click()
            HoldOn.close();
            console.log("param guardado")
            notify_success(data.message);
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);

        });;


     })
    $("#save_params").click(async function () {
        let body = {};
        let type = {};

       

        body.name = $('#in_param_name_edit').val();
        body.description = $('#in_param_description_edit').val();
        body.format = $('#in_format_edit').select2('data')[0].id
        body.default = $('#in_param_default_edit').val();

        type.name = $('#in_type_name_edit').val();
        type.description = $('#in_type_description_edit').val();
        type.key = $('#in_type_key_edit').val();

        body.paramtype = type
        console.log(type)

        if (body.name === '') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }

        save_data_api(root_path + 'app/api/webservice_params/' + _app_id_, body, UPDATE, function (data) {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_edit_param').modal('hide');
            $('#btn_build_function').click()
            HoldOn.close();
            console.log("param guardado")
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
                url: root_path + 'app/api/webservice/' + _app_id_ + '/' + DELETE,
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

            let response = await fetch(root_path + 'app/api/webservice/' + _app_id_ + '/' + UPDATE, {})
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

    $(document.body).on('click', '.btn_edit_param', async function () {

        UPDATE = $(this).val();
        
        try {
            let response = await fetch(root_path + 'app/api/webservice_params/' + _app_id_ + "/" + UPDATE, {})
            let data = await response.json()

            console.log(data.data)

            /**
             * TODO: AGREGAR FUNCION DE EDICION - EDITAR SAVE-PARAMS
             */

            $('#modal_edit_param').modal('show');
            $('#in_param_edit').val(UPDATE);
            $('#in_param_edit').attr('disabled','disabled');
            $('#in_param_name_edit').val(data.data.name);
            $('#in_param_description_edit').val(data.data.description);
            $('#in_param_default_edit').val(data.data.default);
            $('#in_type_name_edit').val(data.data.paramtype.name);
            $('#in_type_description_edit').val(data.data.paramtype.description);
            $('#in_type_key_edit').val(data.data.paramtype.key);
            $('#in_format_edit').val(data.data.format)
            $('#in_format_edit').trigger("change")


        } catch (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        }

    });

    $(document.body).on('click', '.btn_delete_param', function () {
        let DELETE = $(this).val();
        confirm_delete(function () {
            $.ajax({
                url: root_path + 'app/api/webservice_params/' + _app_id_ + '/' + DELETE,
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

    $(document.body).on('click', '.play_element', function () {
        $('#tab_execute').removeClass('disabled').click();
    });

    $('#tab_catalog').click(function () {
        $('#tab_execute').addClass('disabled')
    })


})