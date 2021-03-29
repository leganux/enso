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
            url: root_path + 'app/api/routes/' + _app_id_ + '/datatable',
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


        save_data_api(root_path + 'app/api/routes/' + _app_id_, body, UPDATE, function () {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_new_edit').modal('hide');
        });
    });

    $(document.body).on('change', '.actived_element', function () {
        UPDATE = $(this).val();
        var isChecked = $(this).prop('checked');
        save_data_api(root_path + 'app/api/routes/' + _app_id_, {active: isChecked}, UPDATE, function () {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_new_edit').modal('hide');
        });
    });

    $(document.body).on('click', '.update_element', function () {
        UPDATE = $(this).val();
        $.getJSON(root_path + 'app/api/routes/' + _app_id_ + '/' + UPDATE, {}, function (data) {
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
                url: root_path + 'app/api/routes/' + _app_id_ + '/' + DELETE,
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


$(document).ready(function () {

    var Route_list = [];
    charge_select('#sel_by_role', {where: {active: true}}, root_path + 'app/api/user_roles/' + _app_id_, '_id', 'name');

    HoldOn.open()
    $.getJSON(root_path + 'app/api/routes/' + _app_id_, {where: {active: true}}, function (data) {
        notify_success(data.message);
        $('#sp_url_role').html('')
        $('#sp_url_admin').html('')
        Route_list = data.data;
        data.data.map(function (item, i) {
            if (item.type === 'admin_panel') {
                let see_cad = '<div class="row">' +
                    '<div class="col-4 col-md-4">' + item.url + '</div>' +
                    '<div class="col-8 col-md-8">' +
                    '<label>' + i18n.see +
                    '(GET)&nbsp; <input id="_see_' + item._id + '" class="el_see" type="checkbox"  value="' + item._id + '">' +
                    '</label>' +
                    '</div>' +
                    '</div><hr>';
                $('#sp_url_role').append(see_cad)


            }
            if (item.type === 'api') {
                let see_cad = '<div class="row">' +
                    '<div class="col-6 col-md-4">' + item.url + '</div>';
                if (item.methods.includes('POST')) {
                    see_cad = see_cad + '<div class="col-6 col-md-2">' +
                        '<label>' + i18n.create +
                        '(POST)&nbsp; <input  id="_create_' + item._id + '" class="el_create" type="checkbox"  value="' + item._id + '">' +
                        '</label>' +
                        '</div>';
                }
                if (item.methods.includes('GET')) {
                    see_cad = see_cad + '<div class="col-6 col-md-2">' +
                        '<label>' + i18n.read_all +
                        '(GET)&nbsp; <input id="_read_all_' + item._id + '" class="el_read_all" type="checkbox"  value="' + item._id + '">' +
                        '</label>' +
                        '<br><label>' + i18n.read_mine +
                        '(GET)&nbsp; <input id="_read_mine_' + item._id + '" class="el_read_mine" type="checkbox"  value="' + item._id + '">' +
                        '</label>' +
                        '</div>';
                }

                if (item.methods.includes('PUT')) {
                    see_cad = see_cad + '<div class="col-6 col-md-2">' +
                        '<label>' + i18n.update_all +
                        '(PUT)&nbsp; <input id="_update_all_' + item._id + '" class="el_update_all" type="checkbox"  value="' + item._id + '">' +
                        '</label>' +
                        '<br><label>' + i18n.update_mine +
                        '(PUT)&nbsp; <input id="_update_mine_' + item._id + '" class="el_update_mine" type="checkbox"  value="' + item._id + '">' +
                        '</label>' +
                        '</div>';
                }

                if (item.methods.includes('DELETE')) {
                    see_cad = see_cad + '<div class="col-6 col-md-2">' +
                        '<label>' + i18n.delete_all +
                        '(DELETE) &nbsp; <input id="_delete_all_' + item._id + '" class="el_delete_all" type="checkbox"  value="' + item._id + '">' +
                        '</label>' +
                        '<br><label>' + i18n.delete_mine +
                        '(DELETE)&nbsp; <input id="_delete_mine_' + item._id + '" class="el_delete_mine" type="checkbox"  value="' + item._id + '">' +
                        '</label>' +
                        '</div>';
                }


                see_cad = see_cad + '</div>' +
                    '<hr>';
                $('#sp_url_role').append(see_cad)


            }


        });

        HoldOn.close()

    }).fail(function (err) {
        HoldOn.close();
        notify_error(err.responseJSON.message);
        console.error(err);
    });

    $('#btn_sel_by_role_all').click(function () {
        var rol = $('#sel_by_role').val();
        if (rol == '-1') {
            notify_error(i18n.you_must_select_a_role)
            return false;
        }

        if (Route_list.length > 0) {
            Route_list.map(function (item, i) {
                HoldOn.open()
                $.post(root_path + 'app/api/permission/role/' + _app_id_ + '/updateOrCreate', {
                    where: {
                        role: rol,
                        route: item._id
                    },
                    data: {
                        see: true,
                        create: true,
                        read_me: true,
                        read_all: true,
                        update_me: true,
                        update_all: true,
                        delete_all: true,
                        delete_me: true,
                    }
                }, function (data) {
                    notify_success(data.message);
                }).fail(function (err) {
                    notify_error(err.responseJSON.message);
                    console.error(err);
                });

            });

            $('input[type="checkbox"]').prop('checked', true);
            setTimeout(function () {
                HoldOn.close();
                location.reload()
            }, 1000)
        }
    })


    $('#btn_sel_by_role_none').click(function () {
        var rol = $('#sel_by_role').val();
        if (rol == '-1') {
            notify_error(i18n.you_must_select_a_role)
            return false;
        }

        if (Route_list.length > 0) {
            Route_list.map(function (item, i) {
                HoldOn.open()
                $.post(root_path + 'app/api/permission/role/' + _app_id_ + '/updateOrCreate', {
                    where: {
                        role: rol,
                        route: item._id
                    },
                    data: {
                        see: false,
                        create: false,
                        read_me: false,
                        read_all: false,
                        update_me: false,
                        update_all: false,
                        delete_all: false,
                        delete_me: false,
                    }
                }, function (data) {
                    notify_success(data.message);
                }).fail(function (err) {
                    notify_error(err.responseJSON.message);
                    console.error(err);
                });

            });

            $('input[type="checkbox"]').prop('checked', true);
            setTimeout(function () {
                HoldOn.close();
                location.reload()
            }, 1000)
        }
    })


    /**functions to  save */
    let func_save_rol = function (id_route, isChecked, element, jqueryOb) {
        var rol = $('#sel_by_role').val();
        if (rol == '-1') {
            notify_error(i18n.you_must_select_a_role)
            jqueryOb.prop('checked', !isChecked);
            return 'error';
        }
        HoldOn.open();
        var data = {}
        data[element] = isChecked;
        $.post(root_path + 'app/api/permission/role/' + _app_id_ + '/updateOrCreate', {
            where: {
                role: rol,
                route: id_route
            },
            data: data
        }, function (data) {
            HoldOn.close();
            notify_success(data.message);
        }).fail(function (err) {
            jqueryOb.prop('checked', !isChecked);
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        });
    }


    $(document.body).on('change', '.el_see', function () {
        let ob = $(this);
        let route = $(this).val();
        let isChecked = $(this).prop('checked');
        func_save_rol(route, isChecked, 'see', ob)
    });
    $(document.body).on('change', '.el_create', function () {
        let ob = $(this);
        let route = $(this).val();
        let isChecked = $(this).prop('checked');
        func_save_rol(route, isChecked, 'create', ob)
    });
    $(document.body).on('change', '.el_read_all', function () {
        let ob = $(this);
        let route = $(this).val();
        let isChecked = $(this).prop('checked');
        func_save_rol(route, isChecked, 'read_all', ob)
    });
    $(document.body).on('change', '.el_read_mine', function () {
        let ob = $(this);
        let route = $(this).val();
        let isChecked = $(this).prop('checked');
        func_save_rol(route, isChecked, 'read_me', ob)
    });
    $(document.body).on('change', '.el_update_all', function () {
        let ob = $(this);
        let route = $(this).val();
        let isChecked = $(this).prop('checked');
        func_save_rol(route, isChecked, 'update_all', ob)
    });
    $(document.body).on('change', '.el_update_mine', function () {
        let ob = $(this);
        let route = $(this).val();
        let isChecked = $(this).prop('checked');
        func_save_rol(route, isChecked, 'update_me', ob)
    });
    $(document.body).on('change', '.el_delete_all', function () {
        let ob = $(this);
        let route = $(this).val();
        let isChecked = $(this).prop('checked');
        func_save_rol(route, isChecked, 'delete_all', ob)
    });
    $(document.body).on('change', '.el_delete_mine', function () {
        let ob = $(this);
        let route = $(this).val();
        let isChecked = $(this).prop('checked');
        func_save_rol(route, isChecked, 'delete_me', ob)
    });

    $('#sel_by_role').change(function () {
        let rol = $(this).val()
        $('#sel_by_admin').val(-1)
        $('input[type="checkbox"]').prop('checked', false);
        if (rol == '-1') {
            return false
        }

        HoldOn.open()
        $.getJSON(root_path + 'app/api/permission/role/' + _app_id_, {where: {role: rol}}, function (data) {
            HoldOn.close();
            notify_success(data.message)
            data.data.map(function (item, i) {
                if (!item.route || !item.route._id) {
                    return undefined;
                }
                let id_route = item.route._id;
                if (item.see) {
                    $('#_see_' + id_route).prop('checked', true)
                }
                if (item.create) {
                    $('#_create_' + id_route).prop('checked', true)
                }
                if (item.read_all) {
                    $('#_read_all_' + id_route).prop('checked', true)
                }
                if (item.read_me) {
                    $('#_read_mine_' + id_route).prop('checked', true)
                }
                if (item.update_all) {
                    $('#_update_all_' + id_route).prop('checked', true)
                }
                if (item.update_me) {
                    $('#_update_mine_' + id_route).prop('checked', true)
                }
                if (item.delete_all) {
                    $('#_delete_all_' + id_route).prop('checked', true)
                }
                if (item.delete_me) {
                    $('#_delete_mine_' + id_route).prop('checked', true)
                }

            });
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        });

    });


});
