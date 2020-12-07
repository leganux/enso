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
                "data": "group",

            },
            {
                "data": "direction",
                render: function (data, v, row) {
                    if (data && data.country) {
                        return data.country.name
                    }
                }
            },
            {
                "data": "direction",
                render: function (data, v, row) {
                    if (data && data.state) {
                        return data.state.name
                    }
                }
            },
            {
                "data": "direction",
                render: function (data, v, row) {
                    if (data && data.city) {
                        return data.city.name
                    }
                }
            },
            {
                "data": "direction",
                render: function (data, v, row) {
                    if (data && data.postalCode) {
                        return data.postalCode
                    }
                }
            },
            {
                "data": "direction",
                render: function (data, v, row) {
                    if (data && data.street) {
                        return data.street
                    }
                }
            },
            {
                "data": "direction",
                render: function (data, v, row) {
                    if (data && data.ExtNumber) {
                        return data.ExtNumber
                    }
                }
            },
            {
                "data": "direction",
                render: function (data, v, row) {
                    if (data && data.IntNUmber) {
                        return data.IntNUmber
                    }
                }
            },
            {
                "data": "direction",
                render: function (data, v, row) {
                    if (data && data.reference) {
                        return data.reference
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
        $('#in_cp').val('');
        $('#in_street').val('');
        $('#in_ext_number').val('');
        $('#in_int_number').val('');
        $('#in_reference').val('');


        getlocation()
        getgroup()


        $('#in_state').val('');
        $('#in_city').val('');
        UPDATE = ''
    });

    var getgroup = function () {
        //get all groups
        $.getJSON(root_path + 'app/api/contact_group/' + _app_id_, {}, function (data) {
            for (let i = 0; i < data.data.length; i++) {
                let option = document.createElement("option");
                option.title = data.data[i]._id
                option.value = data.data[i].id
                option.text = data.data[i]._id + " - " + data.data[i].name 
                $('#in_group').append(option)
            }
            $('#in_group').select2()
            $('.select2-selection').css("height", "40px")
            HoldOn.close();
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        });
    }
    var getlocation = function () {
        //clean the options
        $('option').remove();
        
        //get all countries
        $.getJSON(root_path + 'api/places/country', {}, function (data) {
            for (let i = 0; i < data.data.length; i++) {
                let option = document.createElement("option");
                option.title = data.data[i]._id
                option.value = data.data[i].id
                option.text = data.data[i].name
                $('#in_country').append(option)
            }
            $('#in_country').select2()
            $('.select2-selection').css("height", "40px")
            HoldOn.close();
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        });
    }
    $('#in_country').change(function () {
        //get all states
        $('#in_state').children("option").remove()
        $('#in_city').children("option").remove()
        let val = $('#in_country').val()
        $.getJSON(root_path + 'api/places/state', { where: { country_id: String(val) } }, function (data) {

            for (let i = 0; i < data.data.length; i++) {
                let option = document.createElement("option");
                option.title = data.data[i]._id
                option.value = data.data[i].id
                option.text = data.data[i].name
                $('#in_state').append(option)
            }
            $('#in_state').select2()
            $('.select2-selection').css("height", "40px")
            HoldOn.close();
            notify_success(data.message);
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        });
    })
    $('#in_state').change(function () {
        //get all cities
        HoldOn.open()
        $('#in_city').children("option").remove()
        let val = $('#in_state').val()

        $.getJSON(root_path + 'api/places/city', { where: { state_id: String(val) } }, function (data) {
            for (let i = 0; i < data.data.length; i++) {
                let option = document.createElement("option");
                option.title = data.data[i]._id
                option.value = data.data[i].id
                option.text = data.data[i].name
                $('#in_city').append(option)
            }
            $('#in_city').select2()
            $('.select2-selection').css("height", "40px")
            HoldOn.close();
            notify_success(data.message);
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        });
    })


    $('#save_changes').click(function () {
        let body = {};
        let direction = {};

        body.name = $('#in_name').val();
        body.email = $('#in_email').val();
        body.description = $('#in_description').val();
        body.lada = $('#in_lada').val()
        body.phone = $('#in_phone').val();
        body.group = $('#in_group option:selected').attr("title")
        direction.country = $('#in_country option:selected').attr("title")
        direction.state = $('#in_state option:selected').attr("title")
        direction.city = $('#in_city option:selected').attr("title")
        direction.postalCode = $('#in_cp').val();
        direction.street = $('#in_street').val();
        direction.ExtNumber = $('#in_ext_number').val();
        direction.IntNUmber = $('#in_int_number').val();
        direction.reference = $('#in_reference').val()

        if (body.name === '') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }
        HoldOn.open();
        $.post(root_path + 'app/api/contacts/' + _app_id_ + '/direction', direction, function (data) {
            HoldOn.close();
            console.log("direccion guardada")
            notify_success(data.message);

        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);

        });

        $.getJSON(root_path + 'app/api/contact_direction/' + _app_id_, {}, function (data) {
            body.direction = data[0]._id

            save_data_api(root_path + 'app/api/contacts/' + _app_id_, body, UPDATE, function () {
                draw_datatable_rs(DT);
                UPDATE = '';
                $('#modal_new_edit').modal('hide');
                $('#btn_build_function').click()
            });

            HoldOn.close();
            notify_success(data.message);
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        })

    });
    $(document.body).on('click', '.update_element', function () {
        UPDATE = $(this).val();
        getlocation()
        getgroup()
        $.getJSON(root_path + 'app/api/contacts/' + _app_id_ + '/' + UPDATE, {}, function (data) {
            $('#modal_new_edit').modal('show');
            $('#in_name').val(data.data.name);
            $('#in_email').val(data.data.email);
            $('#in_description').val(data.data.description);
            $('#in_lada').val(data.data.lada);
            $('#in_phone').val(data.data.phone);
            $('#selected_group').html(" "+ data.data.group);
            $('#selected_country').html("  "+ data.data.direction.country.name);
            $('#selected_state').html("  "+ data.data.direction.state.name);
            $('#selected_city').html("  "+ data.data.direction.city.name);
            $('#in_cp').val(data.data.direction.postalCode);
            $('#in_street').val(data.data.direction.street);
            $('#in_ext_number').val(data.data.direction.ExtNumber);
            $('#in_int_number').val(data.data.direction.IntNUmber);
            $('#in_reference').val(data.data.direction.reference);

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
                url: root_path + 'app/api/contacts/' + _app_id_ + '/' + DELETE,
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