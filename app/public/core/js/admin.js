$(document).ready(function () {
    $.fn.dataTable.ext.errMode = 'none';
    var UPDATE = '';
    var DT = $("#datatable").DataTable({
        "responsive": true,
        "data": {},
        "columns": [
            {
                "data": "id"
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
                "data": "role_id",
                render: function (data, v, row) {
                    if (row.admin_role) {
                        return row.admin_role.name
                    }
                    return data;
                }
            },
            {
                "data": "active",
                render: function (data, v, row) {
                    if (data) {
                        return '<cente><input value="' + row.id + '" type="checkbox" class="actived_element" checked></cente>'
                    } else {
                        return '<cente><input value="' + row.id + '" type="checkbox" class="actived_element" ></cente>'
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
                data: "id",
                render: function (data, v, row) {
                    return '<button value="' + data + '" class="btn btn-dark btn-block update_element"> <i class="fas fa-edit"></i></button>' +
                        '<button value="' + data + '" class="btn btn-danger btn-block delete_element"> <i class="fas fa-trash"></i></button>';


                }
            }

        ]
    });
    draw_datatable(root_path + 'api/core/admin', DT);

    $('#btn_new_element').click(function () {
        $('#modal_new_edit').modal('show');
        $('#in_username').val('');
        $('#in_email').val('');
        $('#in_password').val('');
        $('#in_role').val('-1');
    });

    $('#save_changes').click(function () {
        let body = {};
        body.username = $('#in_username').val().trim()
        body.email = $('#in_email').val().trim()
        body.password = $('#in_password').val().trim()
        body.role_id = $('#in_role').val().trim()

        if (body.useranme === '' || body.email === '' || body.password === '' || body.role_id === '-1') {
            notify_warning('Fill all fields to continue')
            return false;
        }
        if (!body.email.includes('@') || !body.email.includes('.')) {
            notify_warning('Inavlid email')
            return false;
        }
        if (body.password.length < 8) {
            notify_warning('Password too short')
            return false;
        }

        save_data_api(root_path + 'api/core/admin', body, UPDATE, function () {
            draw_datatable(root_path + 'api/core/admin', DT);
            UPDATE = '';
            $('#modal_new_edit').modal('hide');
        });
    });

    $(document.body).on('change', '.actived_element', function () {
        UPDATE = $(this).val();
        var isChecked = $(this).prop('checked');
        save_data_api(root_path + 'api/core/admin', {active: isChecked}, UPDATE, function () {
            draw_datatable(root_path + 'api/core/admin', DT);
            UPDATE = '';
            $('#modal_new_edit').modal('hide');
        });
    });

    $(document.body).on('click', '.update_element', function () {
        UPDATE = $(this).val();
        $.getJSON(root_path + 'api/core/admin/' + UPDATE, {}, function (data) {
            $('#modal_new_edit').modal('show');
            $('#in_username').val(data.data.username);
            $('#in_email').val(data.data.email);
            $('#in_password').val('');
            $('#in_role').val(data.data.role_id);
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
                url: root_path + 'api/core/admin/' + DELETE,
                method: 'DELETE',
            }).done(function (data) {
                HoldOn.close();
                notify_success('The element has been deleted!')
                draw_datatable(root_path + 'api/core/admin', DT);
                DELETE = '';
            }).fail(function (err) {
                HoldOn.close();
                notify_error(err.message);
                console.error(err);
                DELETE = '';
            });
        });

    });

    charge_select('#in_role', {actived: true}, root_path + 'api/core/admin_roles', 'id', 'name');
    snakeThis('#in_username')
});