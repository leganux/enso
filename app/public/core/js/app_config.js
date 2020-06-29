$(document).ready(function () {

    $(document.body).on('click', '#app_token', function () {
        var copyText = document.getElementById("app_token");
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
        notify_success(i18n.successfully_copied)
    })
    $('#email_serice').val(mail_service)

    var save_data = function () {
        let app_name = $("#app_name").val()

    }

    $('#').click(function () {
        save_data();
    })

})