$(document).ready(function () {

    $(document.body).on('click', '#app_token', function () {
        copy_clipboard("app_token");
    })
    $('#email_serice').val(mail_service)

    $('#gen_new_token').click(function () {
        $('#app_token').val(make_token(13));
    })

    var save_data = function () {
        let body = {};

        body.description = $("#app_description").val()
        body.token = $("#app_token").val()
        body.deployed = false
        body.allow_register = $('#allow_register').prop('checked')
        body.allow_see_backoffice = $('#allow_backoffice').prop('checked')
        body.allow_see_reset_password = $('#allow_reset_pasword').prop('checked')
        body.db_host = $('#app_db_host').val()
        body.db_port = $('#app_db_port').val()
        body.db_user = $('#app_db_username').val()
        body.db_name = $('#app_db_name').val()
        body.db_password = $('#app_db_password').val()
        body.mail_service = $('#email_serice').val()
        body.mail_host = $('#app_mail_host').val()
        body.mail_port = $('#app_mail_port').val()
        body.mail_user = $('#app_mail_user').val()
        body.mail_pass = $('#app_mail_password').val()
        body.mail_from = $('#app_mail_from').val()
        body.default_role = $('#default_role').val()
        body.default_role_new = $('#default_role_register').val()

        save_data_api(root_path + 'api/core/app', body, _app_id_, function (data) {
            console.log(data);
        })

    }

    $('#btn_save_app').click(function () {
        save_data();
    })
    $('#btn_save_email').click(function () {
        save_data();
    })
    $('#btn_save_db').click(function () {
        save_data();
    });
    $('#btn_deploy_app').click(function () {
        HoldOn.open();
        $.post(root_path + 'api/core/app/deploy/' + _app_id_, {}, function (data) {
            HoldOn.close();
            notify_success(data.message);
            HoldOn.open();
            $.post(root_path + 'app/api/cloud_functions/rebuild/' + _app_id_, function (data) {
                HoldOn.close();
                notify_success(data.message);
            }).fail(function (err) {
                HoldOn.close();
                notify_error(err.responseJSON.message);
                console.error(err);
            });

            HoldOn.open();
            $.post(root_path + 'app/api/cron_functions/rebuild/' + _app_id_, function (data) {
                HoldOn.close();
                notify_success(data.message);
            }).fail(function (err) {
                HoldOn.close();
                notify_error(err.responseJSON.message);
                console.error(err);
            });


            HoldOn.open();

            $.post(root_path + 'app/api/db/collection/rebuild/' + _app_id_, function (data) {

                HoldOn.close();
                notify_success(data.message);
            }).fail(function (err) {
                HoldOn.close();
                notify_error(err.responseJSON.message);
                console.error(err);
            });

        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        });
    })

})