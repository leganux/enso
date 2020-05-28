$(document).ready(function () {
    $.fn.dataTable.ext.errMode = 'none';
    var UPDATE = '';
    var UPDATE1 = '';
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
                "data": "lang_code"
            },
            {
                "data": "flag_uc",

            },
            {
                "data": "flag_img",

            },
            {
                "data": "active",
                render: function (data, v, row) {
                    if (data) {
                        return '<cente><input value="' + row._id + '" type="checkbox" class="actived_element" checked></cente>'
                    } else {
                        return '<cente><input value="' + row._id + '" type="checkbox" class="actived_element" ></cente>'
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
            url: root_path + 'api/i18n/language_list/datatable',
            type: "POST"
        },
    });
    draw_datatable_rs(DT);
    var DT1 = $("#datatable1").DataTable({
        "responsive": true,
        "data": {},
        "columns": [
            {
                "data": "_id"
            },
            {
                "data": "language"
            },
            {
                "data": "element_ref"
            },
            {
                "data": "element_text",

            },

            {
                "data": "active",
                render: function (data, v, row) {
                    if (data) {
                        return '<cente><input value="' + row._id + '" type="checkbox" class="actived_element1" checked></cente>'
                    } else {
                        return '<cente><input value="' + row._id + '" type="checkbox" class="actived_element1" ></cente>'
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
                    return '<button value="' + data + '" class="btn btn-dark btn-block update_element1"> <i class="fas fa-edit"></i></button>' +
                        '<button value="' + data + '" class="btn btn-danger btn-block delete_element1"> <i class="fas fa-trash"></i></button>';


                }
            }

        ],
        processing: true,
        serverSide: true,
        ajax: {
            url: root_path + 'api/i18n/language_elements/datatable',
            type: "POST"
        },
    });
    draw_datatable_rs(DT1);

    $('#btn_new_element').click(function () {
        $('#modal_new_edit').modal('show');
        $('#in_name').val('');
        $('#in_lang_code').val('');
        $('#in_flag_uc').val('');
        $('#in_flag_img').val('');
        $('#in_flag_img_save').val('');
    });

    $('#btn_new_element1').click(function () {
        $('#modal_new_edit1').modal('show');
        $('#in1_language').val('-1');
        $('#in1_element_reference').val('');
        $('#in1_element_text').val('');
    });

    $('#save_changes').click(function () {
        let body = {};
        body.name = $('#in_name').val().trim();
        body.lang_code = $('#in_lang_code').val().trim();
        body.flag_uc = $('#in_flag_uc').val();
        body.flag_img = $('#in_flag_img_save').val();


        if (body.name === '' || body.lang_code === '') {
            notify_warning('Fill all fields to continue')
            return false;
        }


        save_data_api(root_path + 'api/i18n/language_list', body, UPDATE, function () {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_new_edit').modal('hide');
            charge_select('#in1_language', {where: {active: true}}, root_path + 'api/i18n/language_list', '_id', 'name');

        });
    });

    $('#save_changes1').click(function () {
        let body = {};
        body.language = $('#in1_language').val().trim();
        body.element_ref = $('#in1_element_reference').val().trim();
        body.element_text = $('#in1_element_text').val().trim();


        if (body.url === '' || body.description === '' || body.type === '-1') {
            notify_warning('Fill all fields to continue')
            return false;
        }


        save_data_api(root_path + 'api/i18n/language_elements', body, UPDATE1, function () {
            draw_datatable_rs(DT1);
            UPDATE1 = '';
            $('#modal_new_edit1').modal('hide');
        });
    });

    $(document.body).on('change', '.actived_element', function () {
        UPDATE = $(this).val();
        var isChecked = $(this).prop('checked');
        save_data_api(root_path + 'api/i18n/language_list', {active: isChecked}, UPDATE, function () {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_new_edit').modal('hide');
        });
    });
    $(document.body).on('change', '.actived_element1', function () {
        UPDATE1 = $(this).val();
        var isChecked = $(this).prop('checked');
        save_data_api(root_path + 'api/i18n/language_elements', {active: isChecked}, UPDATE1, function () {
            draw_datatable_rs(DT1);
            UPDATE1 = '';
            $('#modal_new_edit1').modal('hide');
        });
    });


    $(document.body).on('click', '.update_element', function () {
        UPDATE = $(this).val();
        $.getJSON(root_path + 'api/i18n/language_list/' + UPDATE, {}, function (data) {
            $('#modal_new_edit').modal('show');
            $('#in_name').val(data.data.name);
            $('#in_lang_code').val(data.data.lang_code);
            $('#in_flag_uc').val(data.data.flag_uc);
            $('#in_flag_img').val('');
            $('#in_flag_img_save').val(data.data.flag_img);
            HoldOn.close();
            notify_success(data.message);
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.message);
            console.error(err);
        });
    });
    $(document.body).on('click', '.update_element1', function () {
        UPDATE1 = $(this).val();
        $.getJSON(root_path + 'api/i18n/language_elements/' + UPDATE1, {}, function (data) {
            $('#modal_new_edit1').modal('show');
            $('#in1_language').val(data.data.language);
            $('#in1_element_reference').val(data.data.element_ref);
            $('#in1_element_text').val(data.data.element_text);
            HoldOn.close();
            notify_success(data.message);
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.message);
            console.error(err);
        });
    });

    $(document.body).on('click', '.delete_element', function () {
        let DELETE = $(this).val();
        confirm_delete(function () {
            $.ajax({
                url: root_path + 'api/i18n/language_list/' + DELETE,
                method: 'DELETE',
            }).done(function (data) {
                HoldOn.close();
                notify_success('The element has been deleted!')
                draw_datatable_rs(DT);
                charge_select('#in1_language', {where: {active: true}}, root_path + 'api/i18n/language_list', '_id', 'name');

                DELETE = '';
            }).fail(function (err) {
                HoldOn.close();
                notify_error(err.message);
                console.error(err);
                DELETE = '';
            });
        });

    });

    $(document.body).on('click', '.delete_element1', function () {
        let DELETE = $(this).val();
        confirm_delete(function () {
            $.ajax({
                url: root_path + 'api/i18n/language_elements/' + DELETE,
                method: 'DELETE',
            }).done(function (data) {
                HoldOn.close();
                notify_success('The element has been deleted!')
                draw_datatable_rs(DT1);
                DELETE = '';
            }).fail(function (err) {
                HoldOn.close();
                notify_error(err.message);
                console.error(err);
                DELETE = '';
            });
        });

    });

    charge_select('#in1_language', {where: {active: true}}, root_path + 'api/i18n/language_list', '_id', 'name');
    snakeThis('#in1_element_reference')

});