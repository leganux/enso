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
                "data": "username"
            },
            {
                "data": "email"
            },
            {
                "data": "password",
                render: function (data) {
                    return data.substring(0, 13) + '...';
                }
            },
            {
                data: 'image',
                render: function (data, v, row) {
                    return '<img src="' + data + '" class="img-fluid img-thumbnail">'
                }
            },
            {
                "data": "role",
                render: function (data, v, row) {
                    if (data && data._id) {
                        return data.name
                    }
                    return data;
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
                        '<button value="' + data + '" class="btn btn-danger btn-block delete_element"> <i class="fas fa-trash"></i></button>';


                }
            }

        ],
        processing: true,
        serverSide: true,
        ajax: {
            url: root_path + 'app/api/user/' + _app_id_ + '/datatable',
            type: "POST"
        },
    });
    draw_datatable_rs(DT);

    $('#btn_new_element').click(function () {
        $('#modal_new_edit').modal('show');
        $('#in_username').val('');
        $('#in_email').val('');
        $('#in_password').val('');
        $('#in_profile_image').val('');
        $('#in_profile_image_save').val('');
        $('#in_role').val('-1');
        UPDATE =''
    });

    $('#save_changes').click(function () {
        let body = {};
        body.username = $('#in_username').val().trim()
        body.email = $('#in_email').val().trim()
        body.password = $('#in_password').val().trim()
        body.role = $('#in_role').val().trim()
        body.image = $('#in_profile_image_save').val().trim()

        if (body.useranme === '' || body.email === '' || body.password === '' || body.role === '-1') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }
        if (!body.email.includes('@') || !body.email.includes('.')) {
            notify_warning(i18n.invalid_email)
            return false;
        }
        if (body.password.length < 8) {
            notify_warning(i18n.password_too_short)
            return false;
        }

        save_data_api(root_path + 'app/api/user/' + _app_id_, body, UPDATE, function () {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_new_edit').modal('hide');
        });
    });

    $(document.body).on('change', '.actived_element', function () {
        UPDATE = $(this).val();
        var isChecked = $(this).prop('checked');
        save_data_api(root_path + 'app/api/user/' + _app_id_, {active: isChecked}, UPDATE, function () {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_new_edit').modal('hide');
        });
    });

    $(document.body).on('click', '.update_element', function () {
        UPDATE = $(this).val();
        $.getJSON(root_path + 'app/api/user/' + _app_id_ + '/' + UPDATE, {}, function (data) {
            $('#modal_new_edit').modal('show');
            $('#in_username').val(data.data.username);
            $('#in_email').val(data.data.email);
            $('#in_password').val('');
            $('#in_role').val(data.data.role);
            $('#in_profile_image_save').val(data.data.image);
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
                url: root_path + 'app/api/user/' + _app_id_ + '/' + DELETE,
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

    charge_select('#in_role', {where: {active: true}}, root_path + 'app/api/user_roles/' + _app_id_, '_id', 'name');
    snakeThis('#in_username');
    upload_function('in_profile_image');
});
