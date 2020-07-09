setTimeout(() => {
    if (user && kind_of_user == 'admin') {
        charge_select('#app_select_', {where: {active: true, owner: user}}, root_path + 'api/core/app', '_id', 'name');
        $('#app_select_').show()
    } else {
        $('#app_select_').hide()
    }

    setTimeout(() => {
        if (_app_id_ && _app_id_ !== 'false') {
            $('#sp_4_app').show()
            $('#app_select_').val(_app_id_)
        } else {
            $('#sp_4_app').hide()
            $('#app_select_').val(-1)
        }
    }, 1000)


    $('#app_select_').change(function () {
        let value = $(this).val();
        if (value !== '-1') {
            setCookie('_APP_', value, 10);
            location.reload()
        } else {
            setCookie('_APP_', false, 10);
            location.reload()
        }

    })

}, 1000)



