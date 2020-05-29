$(document).ready(function () {

    charge_select('#sel_by_role', {where: {active: true}}, root_path + 'api/core/admin_roles', '_id', 'name');
    charge_select('#sel_by_admin', {where: {active: true}}, root_path + 'api/core/admin', '_id', 'username');

    HoldOn.open()
    $.getJSON(root_path + 'api/core/routes', {where: {active: true}}, function (data) {
        notify_success(data.message);
        $('#sp_url_role').html('')
        $('#sp_url_admin').html('')
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

            if (item.type === 'api_full') {
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
        notify_error(err.message);
        console.error(err);
    });
});