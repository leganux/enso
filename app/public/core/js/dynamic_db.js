$(document).ready(function () {
    $.fn.dataTable.ext.errMode = 'none';
    var UPDATE = '';
    var UPDATEstr = '';
    var STRUCTURE = '';
    var DATA = '';
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
                "data": "name",
                render: function (data, v, roow) {
                    return '<input ident="' + roow._id + '" id="cpy_' + roow._id + '" class="copy_me form-control" type="text" readonly value="' + root_path + 'app/api/db/data/' + _app_id_ + '/' + data + '">';
                }
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
                        '<button value="' + data + '" class="btn btn-danger btn-block delete_element"> <i class="fas fa-trash"></i></button>' +
                        '<button value="' + data + '" class="btn btn-primary btn-block structure_element"> <i class="fas fa-border-none"></i></button>' +
                        '<button value="' + data + '" class="btn btn-default btn-block data_element"> <i class="fas fa-database"></i></button>';


                }
            }

        ],
        processing: true,
        serverSide: true,
        ajax: {
            url: root_path + 'app/api/db/collection/' + _app_id_ + '/datatable',
            type: "POST"
        },
    });
    draw_datatable_rs(DT);

    $(document.body).on('click', '.copy_me', function () {
        let id = $(this).attr('id');
        copy_clipboard(id)
    })

    $('#btn_new_element').click(function () {
        $('#modal_new_edit').modal('show');
        $('#in_name').val('');
        $('#in_description').val('');
    });

    snakeThis('#in_name');

    $('#save_changes').click(function () {
        let body = {};
        body.name = $('#in_name').val().trim();

        body.description = $('#in_description').val().trim();


        if (body.name === '' || body.description === '') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }


        save_data_api(root_path + 'app/api/db/collection/' + _app_id_, body, UPDATE, function () {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_new_edit').modal('hide');
        });
    });

    $(document.body).on('change', '.actived_element', function () {
        UPDATE = $(this).val();
        var isChecked = $(this).prop('checked');
        save_data_api(root_path + 'app/api/db/collection/' + _app_id_, {active: isChecked}, UPDATE, function () {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_new_edit').modal('hide');
        });
    });

    $(document.body).on('click', '.update_element', function () {
        UPDATE = $(this).val();
        $.getJSON(root_path + 'app/api/db/collection/' + _app_id_ + '/' + UPDATE, {}, function (data) {
            $('#modal_new_edit').modal('show');
            $('#in_name').val(data.data.name);
            $('#in_description').val(data.data.description);
            HoldOn.close();
            notify_success(data.message);
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        });
    });

    $(document.body).on('click', '.delete_element', function () {
        let DELETE = $(this).val();
        confirm_delete(function () {
            $.ajax({
                url: root_path + 'app/api/db/collection/' + _app_id_ + '/' + DELETE,
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

    $('#tab_tables').click(function () {
        $('#tab_structure').addClass('disabled')
        $('#tab_data').addClass('disabled')
    })

    let get_structure = function (id) {
        HoldOn.open();
        let url = root_path + 'app/api/db/collection/' + _app_id_ + '/' + id;
        $.get(url, {}, function (data) {
            HoldOn.close();
            notify_success(data.message);
            if (data.data && data.data.fields) {
                draw_datatable_local(data.data.fields, DTstr)
            }
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        });
    }

    $(document.body).on('click', '.structure_element', function () {
        STRUCTURE = $(this).val();
        $('#tab_structure').removeClass('disabled').click();
        get_structure(STRUCTURE);
        charge_select('#in_str_related', {where: {active: true}}, root_path + 'app/api/db/collection/' + _app_id_, '_id', 'name');
    });
    $(document.body).on('click', '.data_element', function () {
        DATA = $(this).val();
        $('#tab_data').removeClass('disabled').click()
    });


    var DTstr = $("#datatable_st").DataTable({
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
                "data": "kind",

            },
            {
                "data": "related",

            },
            {
                "data": "mandatory",
                render: function (data, v, row) {
                    if (data) {
                        return '<cente><input value="' + row._id + '" type="checkbox" class="mandatory_element" checked></cente>'
                    } else {
                        return '<cente><input value="' + row._id + '" type="checkbox" class="mandatory_element" ></cente>'
                    }
                }

            },
            {
                "data": "default",

            },
            {
                "data": "default_type",

            },
            {
                "data": "default_custom",

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
                    return '<button value="' + data + '" class="btn btn-dark btn-block update_element_str"> <i class="fas fa-edit"></i></button>' +
                        '<button value="' + data + '" class="btn btn-danger btn-block delete_element_str"> <i class="fas fa-trash"></i></button>';
                }
            }

        ],
        processing: true,
        serverSide: true,
        ajax: {
            url: root_path + 'app/api/db/structure/' + _app_id_ + '/datatable',
            type: "POST"
        },
    });

    $('#btn_new_element_str').click(function () {
        $('#modal_new_edit_str').modal('show');
        $('#in_str_name').val('');
        $('#in_str_description').val('');
        $('#in_str_kind').val('string');
        $('#in_str_related').val('');
        $('#in_str_mandatory').val('false');
        $('#in_str_default').val('false');
        $('#SP_dft_').hide();
        $('#in_str_default_type').val('timestamp');
        $('#in_str_custom').val('');
        UPDATEstr = '';
    });

    $('#in_str_default').change(function () {
        if ($(this).val() == 'true') {
            $('#SP_dft_').show();
        } else {
            $('#SP_dft_').hide();
        }
    })

    $('#save_changes_str').click(function () {
        let body = {};
        body.name = $('#in_str_name').val().trim();
        body.description = $('#in_str_description').val();
        body.kind = $('#in_str_kind').val().trim();
        body.related = $('#in_str_related').val();
        body.mandatory = $('#in_str_mandatory').val() == 'true';
        body.default = $('#in_str_default').val() == 'true';
        body.default_type = $('#in_str_default_type').val();
        body.defult_custom = $('#in_str_custom').val();
        body.app = _app_id_


        if (body.name === '' || body.description === '') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }

        if (UPDATEstr === '') {
            save_data_api(root_path + 'app/api/db/collection/field/' + _app_id_, body, '', function () {
                draw_datatable_local(DTstr);
                $('#modal_new_edit').modal('hide');
            });
        } else {
            save_data_api(root_path + 'app/api/db/collection/' + _app_id_, body, UPDATEstr, function () {
                draw_datatable_local(DTstr);
                $('#modal_new_edit').modal('hide');
            });
        }

    });

    snakeThis('#in_str_name');
});