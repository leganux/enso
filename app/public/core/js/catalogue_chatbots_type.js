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
                "data": "key",

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
            url: root_path + 'api/core/chatbotstype/datatable',
            type: "POST"
        },
    });
    draw_datatable_rs(DT);

    $('#btn_new_element').click(function () {
        $('#modal_new_edit').modal('show');
        $('#in_name').val('');
        $('#in_des').val('');



    });

    $('#save_changes').click(function () {
        let body = {};
        body.name = $('#in_name').val().trim();
        body.description = $('#in_des').val().trim();
        body.key =  $('#in_key option:selected').val();

        if (body.name === '' || body.description === '') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }
        if(body.key==0){
            notify_warning(i18n.fill_all_fields)
            return false;
        }

        console.log(body)
        save_data_api(root_path + 'api/core/chatbotstype', body, UPDATE, function () {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_new_edit').modal('hide');
           // charge_select('#in1_language', {where: {active: true}}, root_path + '/core/chatbotstype/', '_id', 'name');

        });
    });


    $(document.body).on('change', '.actived_element', function () {
        UPDATE = $(this).val();
        var isChecked = $(this).prop('checked');
        save_data_api(root_path + 'api/core/chatbotstype', {active: isChecked}, UPDATE, function () {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_new_edit').modal('hide');
        });
    });

    $(document.body).on('click', '.update_element', function () {
        UPDATE = $(this).val();
        $.getJSON(root_path + 'api/core/chatbotstype/' + UPDATE, {}, function (data) {
            $('#modal_new_edit').modal('show');
            $('#in_name').val(data.data.name);
            $('#in_des').val(data.data.description);
            $('#in_key').val(data.data.key);
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
                url: root_path + 'api/core/chatbotstype/' + DELETE,
                method: 'DELETE',
            }).done(function (data) {
                HoldOn.close();
                notify_success(i18n.element_deleted)
                draw_datatable_rs(DT);
                //charge_select('#in1_language', {where: {active: true}}, root_path + 'api/i18n/language_list', '_id', 'name');

                DELETE = '';
            }).fail(function (err) {
                HoldOn.close();
                notify_error(err.responseJSON.message);
                console.error(err);
                DELETE = '';
            });
        });

    });


    //charge_select('#in1_language', {where: {active: true}}, root_path + 'api/i18n/language_list', '_id', 'name');
    snakeThis('#in1_element_reference')

    $('#in1_element_text').change(function () {
        let text = $('#in1_element_text').val();
        $('#in1_element_reference').val(v.snakeCase(text).toLowerCase());
    })

});