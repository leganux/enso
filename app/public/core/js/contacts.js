
var countryID, stateID, cityID
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
                render: function (data, v, row) {
                    if (data) {
                        return data.name
                    }
                }

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

    var getgroup = async function () {
        $("#in_group").html('')
        try {
            let response = await fetch(root_path + 'app/api/contact_group/' + _app_id_ + "/groups", {})
            let data = await response.json()

            for (let i = 0; i < data.length; i++) {
                let option = document.createElement("option");
                option.value = data[i]._id
                option.text = data[i].name
                $('#in_group').append(option)
            }
            $('#in_group').select2()
            $('.select2-selection').css("height", "40px")
            HoldOn.close();

        } catch (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        }

    }

    var getlocationCountry = async function () {
        try {
            let response = await fetch(root_path + 'api/places/country', {})
            let data = await response.json()
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
        } catch (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        }
    }
    var getlocationState = async function (country_id) {
        countryID = String(country_id)
        try {
            let response = await fetch(root_path + 'api/places/state' + '?where[country_id]=' + countryID, {})
            let data = await response.json()

            for (let i = 0; i < data.data.length; i++) {
                let option = document.createElement("option");
                option.title = data.data[i]._id
                option.value = data.data[i].id
                option.text = data.data[i].name
                $('#in_state').append(option)
            }
            $('#in_state').select2()
            $("#in_state").trigger("change")
            $('.select2-selection').css("height", "40px")
            HoldOn.close();
            notify_success(data.message);


        } catch (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        }
    }

    var getlocationCity = async function (state_id) {
        state_Id = String(state_id)
        try {
            let response = await fetch(root_path + 'api/places/city' + '?where[state_id]=' + state_Id, {})
            let data = await response.json()
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
        } catch (err) {
            HoldOn.close();
            notify_error(err.stringify(err));
            console.error(err);
        }

    }

    $('#in_country').change(async function () {
        $('#in_state').html('')
        $('#in_city').html('')

        let val = $('#in_country').val()
        await getlocationState(val)
    })


    $('#in_state').change(async function () {
        $('#in_city').html('')

        let val = $('#in_state').val()

        await getlocationCity(val)
    })

    
    getlocationCountry()
    getgroup()

    $('#btn_new_element').click(function () {
        $('#in_state').html('')
        $('#in_city').html('')
        $('#in_country').html('')
        $('#in_group').html('')
        getlocationCountry()
        getgroup()
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

        $('#in_state').val('');
        $('#in_city').val('');
        UPDATE = ''
    });


    $('#save_changes').click(async function () {
        let body = {};
        let direction = {};

        body.name = $('#in_name').val();
        body.email = $('#in_email').val();
        body.description = $('#in_description').val();
        body.lada = $('#in_lada').val()
        body.phone = $('#in_phone').val();

        body.group = $('#in_group').select2('data')[0].id

        direction.country = $('#in_country').select2('data')[0].title
        direction.state = $('#in_state').select2('data')[0].title
        direction.city = $('#in_city').select2('data')[0].title

        direction.postalCode = $('#in_cp').val();
        direction.street = $('#in_street').val();
        direction.ExtNumber = $('#in_ext_number').val();
        direction.IntNUmber = $('#in_int_number').val();
        direction.reference = $('#in_reference').val()

        body.direction = direction
        

        //Conditions
        if (body.name === '') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }
        if (isNaN(body.phone) || isNaN(direction.postalCode)) {
            notify_warning(i18n.most_be_a_number)
            return false;
        }

        save_data_api(root_path + 'app/api/contacts/' + _app_id_, body, UPDATE, function () {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_new_edit').modal('hide');
            $('#btn_build_function').click()
            HoldOn.close();
            console.log("direccion guardada")
            notify_success(data.message);
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);

        });;

        //Api function
        /*HoldOn.open();
        $.post(root_path + 'app/api/contacts/' + _app_id_ + '/direction', direction, function (data) {
            HoldOn.close();
            console.log("direccion guardada")
            notify_success(data.message);

        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);

        });*/

        //$.getJSON(root_path + 'app/api/contact_direction/' + _app_id_, {}, function (data) {
        //body.direction = data[0]._id



    });

    $(document.body).on('click', '.update_element', async function () {
        UPDATE = $(this).val();
        try {

            let response = await fetch(root_path + 'app/api/contacts/' + _app_id_ + '/' + UPDATE, {})
            let data = await response.json()

            $('#modal_new_edit').modal('show');
            $('#in_name').val(data.data.name);
            $('#in_email').val(data.data.email);
            $('#in_description').val(data.data.description);
            $('#in_lada').val(data.data.lada);
            $('#in_phone').val(data.data.phone);
            $('#in_cp').val(data.data.direction.postalCode);
            $('#in_street').val(data.data.direction.street);
            $('#in_ext_number').val(data.data.direction.ExtNumber);
            $('#in_int_number').val(data.data.direction.IntNUmber);
            $('#in_reference').val(data.data.direction.reference);

            await getgroup()
            $('#in_group').val(data.data.group._id)
            $('#in_group').trigger("change")

            countryID = data.data.direction.country.id
            stateID = data.data.direction.state.id
            cityID = data.data.direction.city.id

            await getlocationCountry()
            $('#in_country').val(countryID)
            $('#in_country').trigger("change")
            await getlocationState(countryID)
            $('#in_state').val(stateID)
            $('#in_state').trigger("change")
            await getlocationCity(stateID)
            $('#in_city').val(cityID)
            $('#in_city').trigger("change")


        } catch (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        }


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