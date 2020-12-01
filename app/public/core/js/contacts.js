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
                "data": "email"
            },
            {
                "data": "description"
            },
            {
                "data": "lada"
            },
            {
                "data": "phone"
            },
            {
                "data": "group"
            },
            {
                "data": "country"
            },
            {
                "data": "state"
            },
            {
                "data": "city"
            },
            {
                "data": "postalCode",
            },
            {
                "data": "street",
            },
            {
                "data": "ExtNumber",
            },
            {
                "data": "IntNUmber",
            },
            {
                "data": "reference",
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
            url: root_path + 'app/api/contacts/' + _app_id_ + '/datatable',
            type: "POST"
        },
    });
    draw_datatable_rs(DT);
    
    $('#btn_new_element').click(function () {
        $('#modal_new_edit').modal('show');
        $('#in_name').val('');
        $('#in_email').val('');
        $('#in_description').val('');
        $('#in_lada').val('');
        $('#in_phone').val('');
        $('#in_country').val('');
        $('#in_state').val('');
        $('#in_city').val('');
        $('#in_cp').val('');
        $('#in_street').val('');
        $('#in_ext_number').val('');
        $('#in_int_number').val('');
        $('#in_reference').val('');
        UPDATE = ''
    });
    


    $('#save_changes').click(function () {
        let body = {};
        let direction = {};

        body.name = $('#in_name').val();
        body.emai = $('#in_email').val();
        body.description = $('#in_description').val();
        body.lada = $('#in_lada').val()
        body.phone = $('#in_phone').val();
        direction.country = $('#in_country').val();
        direction.state = $('#in_state').val();
        direction.city = $('#in_city').val();
        direction.cp = $('#in_cp').val();
        direction.street = $('#in_street').val();
        direction.ext_number = $('#in_ext_number').val();
        direction.int_number = $('#in_int_number').val();
        direction.reference = $('#in_reference').val();


        if (body.name === '') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }
        save_data_api(root_path + 'app/api/contacts_direction/' + _app_id_, direction, UPDATE, function () {
            //mandar a llamar app_id para comparar con app_id de direccion
        });
        save_data_api(root_path + 'app/api/contacts/' + _app_id_,[{body,direction}], UPDATE, function () {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_new_edit').modal('hide');
            $('#btn_build_function').click()
        });
    });
    $(document.body).on('click', '.update_element', function () {
        UPDATE = $(this).val();
        $.getJSON(root_path + 'app/api/contacts/' + _app_id_ + '/' + UPDATE, {}, function (data) {
            $('#modal_new_edit').modal('show');
            $('#in_name').val(data.data.name);
            $('#in_email').val(data.data.email);
            $('#in_description').val(data.data.description);
            $('#in_lada').val(data.data.lada);
            $('#in_phone').val(data.data.phone);
            $('#in_country').val(data.data.country);
            $('#in_state').val(data.data.state);
            $('#in_city').val(data.data.city);
            $('#in_cp').val(data.data.cp);
            $('#in_street').val(data.data.street);
            $('#in_ext_number').val(data.data.ExtNumber);
            $('#in_int_number').val(data.data.IntNUmber);
            $('#in_reference').val(data.data.reference);


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
                url: root_path + 'app/api/cron_functions/' + _app_id_ + '/' + DELETE,
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