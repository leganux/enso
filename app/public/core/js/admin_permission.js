$(document).ready(function () {

    var Route_list = [];
    charge_select('#sel_by_role', {where: {active: true}}, root_path + 'api/core/admin_roles', '_id', 'name');
    charge_select('#sel_by_admin', {where: {active: true}}, root_path + 'api/core/admin', '_id', 'username');

    HoldOn.open()
    $.getJSON(root_path + 'api/core/routes', {where: {active: true}}, function (data) {
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
                    '&nbsp; <input id="_see_' + item._id + '" class="el_see" type="checkbox"  value="' + item._id + '">' +
                    '</label>' +
                    '</div>' +
                    '</div><hr>';
                $('#sp_url_role').append(see_cad)

                see_cad = see_cad.replace(/_see_/g, '_see_adm_');
                see_cad = see_cad.replace(/el_see/g, 'el_see_adm');
                $('#sp_url_admin').append(see_cad)
            }
            if (item.type === 'api') {
                let see_cad = '<div class="row">' +
                    '<div class="col-6 col-md-4">' + item.url + '</div>' +

                    '<div class="col-6 col-md-2">' +
                    '<label>' + i18n.create +
                    '&nbsp; <input  id="_create_' + item._id + '" class="el_create" type="checkbox"  value="' + item._id + '">' +
                    '</label>' +
                    '</div>' +

                    '<div class="col-6 col-md-2">' +

                    '<label>' + i18n.read_all +
                    '&nbsp; <input id="_read_all_' + item._id + '" class="el_read_all" type="checkbox"  value="' + item._id + '">' +
                    '</label>' +
                    '</div>' +

                    '<div class="col-6 col-md-2">' +

                    '<label>' + i18n.update_all +
                    '&nbsp; <input id="_update_all_' + item._id + '" class="el_update_all" type="checkbox"  value="' + item._id + '">' +
                    '</label>' +
                    '</div>' +

                    '<div class="col-6 col-md-2">' +

                    '<label>' + i18n.delete_all +
                    '&nbsp; <input id="_delete_all_' + item._id + '" class="el_delete_all" type="checkbox"  value="' + item._id + '">' +
                    '</label>' +
                    '</div>' +
                    '</div>' +
                    '<hr>';
                $('#sp_url_role').append(see_cad)

                see_cad = see_cad.replace(/el_create/g, 'el_create_adm');
                see_cad = see_cad.replace(/el_read_all/g, 'el_read_all_adm');
                see_cad = see_cad.replace(/el_update_all/g, 'el_update_all_adm');
                see_cad = see_cad.replace(/el_delete_all/g, 'el_delete_all_adm');

                see_cad = see_cad.replace(/_create_/g, '_create_adm_');
                see_cad = see_cad.replace(/_read_all_/g, '_read_all_adm_');
                see_cad = see_cad.replace(/_update_all_/g, '_update_all_adm_');
                see_cad = see_cad.replace(/_delete_all_/g, '_delete_all_adm_');
                $('#sp_url_admin').append(see_cad)
            }

            if (item.type === 'api_full' || item.type === 'other') {
                let see_cad = '<div class="row">' +
                    '<div class="col-6 col-md-4">' + item.url + '</div>' +

                    '<div class="col-6 col-md-2">' +
                    '<label>' + i18n.create +
                    '&nbsp; <input  id="_create_' + item._id + '" class="el_create" type="checkbox"  value="' + item._id + '">' +
                    '</label>' +
                    '</div>' +

                    '<div class="col-6 col-md-2">' +
                    '<label>' + i18n.read_mine +
                    '&nbsp; <input id="_read_mine_' + item._id + '" class="el_read_mine" type="checkbox"  value="' + item._id + '">' +
                    '</label>' +
                    '<label>' + i18n.read_all +
                    '&nbsp; <input id="_read_all_' + item._id + '" class="el_read_all" type="checkbox"  value="' + item._id + '">' +
                    '</label>' +
                    '</div>' +

                    '<div class="col-6 col-md-2">' +
                    '<label>' + i18n.update_mine +
                    '&nbsp; <input id="_update_mine_' + item._id + '" class="el_update_mine" type="checkbox"  value="' + item._id + '">' +
                    '</label>' +
                    '<label>' + i18n.update_all +
                    '&nbsp; <input id="_update_all_' + item._id + '" class="el_update_all" type="checkbox"  value="' + item._id + '">' +
                    '</label>' +
                    '</div>' +

                    '<div class="col-6 col-md-2">' +
                    '<label>' + i18n.delete_mine +
                    '&nbsp; <input id="_delete_mine_' + item._id + '" class="el_delete_mine" type="checkbox"  value="' + item._id + '">' +
                    '</label>' +
                    '<label>' + i18n.delete_all +
                    '&nbsp; <input id="_delete_all_' + item._id + '" class="el_delete_all" type="checkbox"  value="' + item._id + '">' +
                    '</label>' +
                    '</div>' +


                    '</div>' +
                    '<hr>';
                $('#sp_url_role').append(see_cad)

                see_cad = see_cad.replace(/el_create/g, 'el_create_adm');
                see_cad = see_cad.replace(/el_read_all/g, 'el_read_all_adm');
                see_cad = see_cad.replace(/el_update_all/g, 'el_update_all_adm');
                see_cad = see_cad.replace(/el_delete_all/g, 'el_delete_all_adm');


                see_cad = see_cad.replace(/el_read_mine/g, 'el_read_mine_adm');
                see_cad = see_cad.replace(/el_update_mine/g, 'el_update_mine_adm');
                see_cad = see_cad.replace(/el_delete_mine/g, 'el_delete_mine_adm');


                see_cad = see_cad.replace(/_create_/g, '_create_adm_');

                see_cad = see_cad.replace(/_read_all_/g, '_read_all_adm_');
                see_cad = see_cad.replace(/_update_all_/g, '_update_all_adm_');
                see_cad = see_cad.replace(/_delete_all_/g, '_delete_all_adm_');

                see_cad = see_cad.replace(/_read_mine_/g, '_read_mine_adm_');
                see_cad = see_cad.replace(/_update_mine_/g, '_update_mine_adm_');
                see_cad = see_cad.replace(/_delete_mine_/g, '_delete_mine_adm_');
                $('#sp_url_admin').append(see_cad)
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
                $.post(root_path + 'api/core/permission/role/updateOrCreate', {
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

    $('#btn_sel_by_admin_all').click(function () {
        var rol = $('#sel_by_admin').val();
        if (rol == '-1') {
            notify_error(i18n.you_must_select_an_admin)
            return false;
        }

        if (Route_list.length > 0) {
            Route_list.map(function (item, i) {
                HoldOn.open()
                $.post(root_path + 'api/core/permission/admin/updateOrCreate', {
                    where: {
                        admin: rol,
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
                $.post(root_path + 'api/core/permission/role/updateOrCreate', {
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

    $('#btn_sel_by_admin_none').click(function () {
        var rol = $('#sel_by_admin').val();
        if (rol == '-1') {
            notify_error(i18n.you_must_select_an_admin)
            return false;
        }

        if (Route_list.length > 0) {
            Route_list.map(function (item, i) {
                HoldOn.open()
                $.post(root_path + 'api/core/permission/admin/updateOrCreate', {
                    where: {
                        admin: rol,
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
        $.post(root_path + 'api/core/permission/role/updateOrCreate', {
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
    let func_save_admin = function (id_route, isChecked, element, jqueryOb) {
        var rol = $('#sel_by_admin').val();
        if (rol == '-1') {
            notify_error(i18n.you_must_select_an_admin)
            jqueryOb.prop('checked', !isChecked);
            return 'error';
        }
        HoldOn.open();
        var data = {}
        data[element] = isChecked;
        $.post(root_path + 'api/core/permission/admin/updateOrCreate', {
            where: {
                admin: rol,
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

    $(document.body).on('change', '.el_see_adm', function () {
        let ob = $(this);
        let route = $(this).val();
        let isChecked = $(this).prop('checked');
        func_save_admin(route, isChecked, 'see', ob)
    });

    $(document.body).on('change', '.el_create_adm_adm', function () {
        let ob = $(this);
        let route = $(this).val();
        let isChecked = $(this).prop('checked');
        func_save_admin(route, isChecked, 'create', ob)
    });

    $(document.body).on('change', '.el_read_all_adm_adm', function () {
        let ob = $(this);
        let route = $(this).val();
        let isChecked = $(this).prop('checked');
        func_save_admin(route, isChecked, 'read_all', ob)
    });

    $(document.body).on('change', '.el_read_mine_adm_adm', function () {
        let ob = $(this);
        let route = $(this).val();
        let isChecked = $(this).prop('checked');
        func_save_admin(route, isChecked, 'read_me', ob)
    });

    $(document.body).on('change', '.el_update_mine_adm_adm', function () {
        let ob = $(this);
        let route = $(this).val();
        let isChecked = $(this).prop('checked');
        func_save_admin(route, isChecked, 'update_me', ob)
    });
    $(document.body).on('change', '.el_update_all_adm_adm', function () {
        let ob = $(this);
        let route = $(this).val();
        let isChecked = $(this).prop('checked');
        func_save_admin(route, isChecked, 'update_all', ob)
    });

    $(document.body).on('change', '.el_delete_all_adm_adm', function () {
        let ob = $(this);
        let route = $(this).val();
        let isChecked = $(this).prop('checked');
        func_save_admin(route, isChecked, 'delete_all', ob)
    });
    $(document.body).on('change', '.el_delete_mine_adm_adm', function () {
        let ob = $(this);
        let route = $(this).val();
        let isChecked = $(this).prop('checked');
        func_save_admin(route, isChecked, 'delete_me', ob)
    });


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
        $.getJSON(root_path + 'api/core/permission/role/', {where: {role: rol}}, function (data) {
            HoldOn.close();
            notify_success(data.message)
            data.data.map(function (item, i) {
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

    $('#sel_by_admin').change(function () {
        let rol = $(this).val()
        $('#sel_by_role').val(-1)
        $('input[type="checkbox"]').prop('checked', false);
        if (rol == '-1') {
            return false
        }

        HoldOn.open()
        $.getJSON(root_path + 'api/core/permission/admin/', {where: {admin: rol}}, function (data) {
            HoldOn.close();
            notify_success(data.message)
            data.data.map(function (item, i) {
                let id_route = item.route._id;
                if (item.see) {
                    $('#_see_adm_' + id_route).prop('checked', true)
                }
                if (item.create) {
                    $('#_create_adm_' + id_route).prop('checked', true)
                }
                if (item.read_all) {
                    $('#_read_all_adm_' + id_route).prop('checked', true)
                }
                if (item.read_me) {
                    $('#_read_mine_adm_' + id_route).prop('checked', true)
                }
                if (item.update_all) {
                    $('#_update_all_adm_' + id_route).prop('checked', true)
                }
                if (item.update_me) {
                    $('#_update_mine_adm_' + id_route).prop('checked', true)
                }
                if (item.delete_all) {
                    $('#_delete_all_adm_' + id_route).prop('checked', true)
                }
                if (item.delete_me) {
                    $('#_delete_mine_adm_' + id_route).prop('checked', true)
                }

            });
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        });

    });


});