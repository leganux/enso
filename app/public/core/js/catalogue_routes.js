$(document).ready(function () {


    $('#in_method').select2({
        placeholder: i18n.choose_one,
        allowClear: true,
        multiple: true,
        width: 'resolve',

    });

    $('#in_type').change(function () {
        let vau = $(this).val()
        if (vau === 'api') {
            $('#sp_methods').show()
        } else {
            $('#sp_methods').hide()
        }
    })

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
                "data": "url"
            },
            {
                "data": "description"
            },
            {
                "data": "type",

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
            url: root_path + 'api/core/routes/datatable',
            type: "POST"
        },
    });
    draw_datatable_rs(DT);

    $('#btn_new_element').click(function () {
        $('#modal_new_edit').modal('show');
        $('#sp_methods').hide()
        $('#in_url').val('');
        $('#in_description').val('');
        $('#in_type').val('-1');
    });

    $('#save_changes').click(function () {
        let body = {};
        body.url = $('#in_url').val().trim();
        body.description = $('#in_description').val().trim();
        body.type = $('#in_type').val();

        let resutls = $('#in_method').select2('data');
        body.methods = resutls.map(function (item, i) {
            return item.id;
        }).join(',');


        if (body.url === '' || body.description === '' || body.type === '-1') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }


        save_data_api(root_path + 'api/core/routes', body, UPDATE, function () {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_new_edit').modal('hide');
        });
    });

    $(document.body).on('change', '.actived_element', function () {
        UPDATE = $(this).val();
        var isChecked = $(this).prop('checked');
        save_data_api(root_path + 'api/core/routes', {active: isChecked}, UPDATE, function () {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_new_edit').modal('hide');
        });
    });

    $(document.body).on('click', '.update_element', function () {
        UPDATE = $(this).val();
        $.getJSON(root_path + 'api/core/routes/' + UPDATE, {}, function (data) {
            $('#modal_new_edit').modal('show');
            $('#in_url').val(data.data.url);
            $('#in_description').val(data.data.description);
            $('#in_type').val(data.data.type);
            if (data.data.type == 'api') {
                $('#sp_methods').show()
            }
            $('#in_method').val(data.data.methods && data.data.methods.length > 0 ? data.data.methods.split(',') : []);
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
                url: root_path + 'api/core/routes/' + DELETE,
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


});