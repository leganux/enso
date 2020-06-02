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
                "data": "token",
                render: function (data, v, row) {
                    return '<input  id="tk_copy_' + row._id + '" readonly value="' + data + '" class="form-control">' +
                        '<br><button value="' + row._id + '" class="btn btn-dark btn-block copy_tkn_">' + i18n.copy + '</button>';
                }
            },
            {
                "data": "owner.username",

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
            url: root_path + 'api/core/app/datatable',
            type: "POST"
        },
    });
    draw_datatable_rs(DT);

    $(document.body).on('click', '.copy_tkn_', function () {
        let val = $(this).val()
        var copyText = document.getElementById("tk_copy_" + val);
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
        notify_success(i18n.successfully_copied)
    })

    $('#btn_new_element').click(function () {
        $('#modal_new_edit').modal('show');
        $('#in_name').val('').prop('disabled', false);
        $('#in_description').val('');
        $('#in_token').val(make_token()).prop('disabled', true);
        $('#save_changes').prop('disabled', true);

    });
    $('#in_name').change(function () {
        let name_ = $('#in_name').val()
        name_ = v.snakeCase(name_)
        $.getJSON(root_path + 'api/core/app', {where: {name: name_}}, function (data) {
            if (!data.data || data.data.length < 1) {
                $('#save_changes').prop('disabled', false);
            } else {
                $('#save_changes').prop('disabled', true);
                notify_warning(i18n.an_app_with_this_name_already_exists)
            }

        }).fail(function (err) {

        });
    });

    $('#save_changes').click(function () {
        let body = {};
        body.name = $('#in_name').val().trim()
        body.description = $('#in_description').val().trim()
        body.token = $('#in_token').val().trim()


        if (body.name === '' || body.description === '' || body.token === '') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }


        save_data_api(root_path + 'api/core/app', body, UPDATE, function () {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_new_edit').modal('hide');
        });
    });

    $(document.body).on('change', '.actived_element', function () {
        UPDATE = $(this).val();
        var isChecked = $(this).prop('checked');
        save_data_api(root_path + 'api/core/app', {active: isChecked}, UPDATE, function () {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_new_edit').modal('hide');
        });
    });

    $(document.body).on('click', '.update_element', function () {
        UPDATE = $(this).val();
        $.getJSON(root_path + 'api/core/app/' + UPDATE, {}, function (data) {
            $('#modal_new_edit').modal('show');
            $('#in_name').val('').prop('disabled', true);
            $('#in_name').val(data.data.name);
            $('#in_description').val(data.data.description);
            $('#in_token').val(data.data.token).prop('disabled', true);
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
                url: root_path + 'api/core/app/' + DELETE,
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


    snakeThis('#in_name');
});