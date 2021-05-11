$(document).ready(async function () {

    $('#btn_save').click(function () {
        let body = {};
        body.messageText = $('#message').val();
        if (body.messageText === '') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }

        HoldOn.open();
        $.post(root_path + 'app/api/sms_gateway/' + _app_id_, body, function (data) {
            HoldOn.close();
            getAllMails();
            notify_success(data.message)
            $('#message').val('');
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
            DELETE = '';
        });
    });

    $('#btn_send').on("click", function () {
        let body = {};
        body.messageText = $('#message').val();
        if (body.messageText === '') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }
        body.Number = $('#to').val()

        HoldOn.open();
        let numbers = body.Number.split(",")
        console.log(numbers)


        body.Number = numbers
        $.post(root_path + 'app/api/sms_gateway/saveTOSend/' + _app_id_, body, function (data) {
            HoldOn.close();
            getAllMails();
            notify_success(data.message)
            $('#message').val('');
            $('#to').val('')
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);

        });

        console.log(numbers)

    })

    let getAllMails = function () {
        HoldOn.open();
        $.getJSON(root_path + 'app/api/sms_gateway/' + _app_id_, {where: {app: _app_id_}}, function (data) {
            HoldOn.close();
            notify_success(data.message);
            if (data.data.length > 0) {
                $('#saved_message').html('');
                data.data.map(function (item, i) {
                    $('#saved_message').append('<div class="row">' +
                        '                    <div class="col-8">' +
                        '                      <button value="' + item._id + '" class="btn-link btn choose_template"><i class="fas fa-envelope"></i> ' + item.messageText + '</button>' +
                        '                    </div>' +
                        '                    <div class="col-4">' +
                        '                      <button value="' + item._id + '" class="btn btn-danger btn-sm btn-block delete_template"><i class="fas fa-trash"></i></button>' +
                        '                    </div>' +
                        '                  </div> <hr>');
                });
            }
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
            DELETE = '';
        });

    }

    let getallMessage = async function () {
        $.ajax({
            url: root_path + 'app/api/sms_gateway/unsended/' + _app_id_,
            method: 'GET',
        }).done(function (datas) {
            console.log("datas", datas)
            HoldOn.close();
            notify_success(i18n.element_deleted)
            //$('#urlsms').val(Domain + root_path + 'app/api/sms_gateway/unsended/' + _app_id_)

        })
    }

    let URLdomain = location.host
    let URLprotocol = location.protocol

    $('#urlsms').val(URLprotocol + '//' + URLdomain + root_path + 'app/api/sms_gateway/unsended/' + _app_id_)
    let options = {
        // render method: 'canvas', 'image' or 'div'
        render: 'image',

        // version range somewhere in 1 .. 40
        minVersion: 1,
        maxVersion: 40,

        // error correction level: 'L', 'M', 'Q' or 'H'
        ecLevel: 'L',

        // offset in pixel if drawn onto existing canvas
        left: 0,
        top: 0,

        // size in pixel
        size: 100,

        // code color or image element
        fill: '#000',

        // background color or image element, null for transparent background
        background: null,

        // content
        text: URLprotocol + "//" + URLdomain + root_path + 'app/api/sms_gateway/unsended/' + _app_id_,

        // corner radius relative to module width: 0.0 .. 0.5
        radius: 0,

        // quiet zone in modules
        quiet: 0,

        // modes
        // 0: normal
        // 1: label strip
        // 2: label box
        // 3: image strip
        // 4: image box
        mode: 0,

        mSize: 0.1,
        mPosX: 0.5,
        mPosY: 0.5,

        label: 'no label',
        fontname: 'sans',
        fontcolor: '#000',

        image: null
    }
    $('#QRmessaeg').qrcode(options);

    let getAllContacts = function () {

        charge_select('#contacts_group', {where: {app: _app_id_}}, root_path + 'app/api/contact_group/' + _app_id_, '_id', 'name')

        $('#sp_for_goups').html('');
        HoldOn.open();
        $.getJSON(root_path + 'app/api/contact_group/' + _app_id_, {where: {app: _app_id_}}, function (data) {
            HoldOn.close();
            notify_success(data.message);
            if (data.data.length > 0) {

                data.data.map(function (item, i) {
                    $('#sp_for_goups').append('<div class="row">' +
                        '                    <div class="col-8">' +
                        '                      <button value="' + item._id + '" class="btn-link btn choose_c_group text-capitalize"><i class="fas fa-envelope"></i> ' + item.name + '</button>' +
                        '                       <br> <small class="pl-3"> ' + item.description + ' </small>' +
                        '                    </div>' +
                        '                    <div class="col-4">' +
                        '                      <button value="' + item._id + '" class="btn btn-danger btn-sm btn-block delete_c_group w-75 mb-3 ml-auto mr-auto"><i class="fas fa-trash"></i></button>' +
                        //add item.id for the new button, it exist but without a funcition   
                        '                     <button value="' + item._id + '" class="btn btn-success btn-sm btn-block select_All w-75 mb-3 ml-auto mr-auto"><i class="fas fa-mail-bulk"></i></button>' +
                        '                    </div>' +
                        '                  </div> <hr>');
                });
            }
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        });
    }

    let getAllContacts_single = function () {
        HoldOn.open();
        $('#sp_for_contacts').html('');
        $.getJSON(root_path + 'app/api/contacts/' + _app_id_, {where: {app: _app_id_}}, function (data) {
            HoldOn.close();
            notify_success(data.message);
            if (data.data.length > 0) {

                data.data.map(function (item, i) {
                    $('#sp_for_contacts').append('<div class="row">' +
                        '                    <div class="col-8">' +
                        '                      <button value="' + item._id + '" class="btn-link btn choose_no_repeat text-capitalize""><i class="fas fa-envelope"></i> ' + item.name + '</button>' +
                        '<br> <small class="pl-3"> ' + item.lada + item.phone + ' </small>' +
                        '                    </div>' +
                        '                    <div class="col-4">' +
                        '                      <button value="' + item._id + '" class="btn btn-danger btn-sm btn-block delete_c w-75 mb-3 ml-auto mr-auto"><i class="fas fa-trash"></i></button>' +
                        '                    </div>' +
                        '                  </div> <hr>');
                });
            }
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        });
    }


    $(document.body).on('click', '.delete_template', function () {
        let value = $(this).val();
        confirm_delete(function () {
            $('#saved_message').html('');
            $.ajax({
                url: root_path + 'app/api/sms_gateway/' + _app_id_ + '/' + value,
                method: 'DELETE',
            }).done(function (data) {
                HoldOn.close();
                notify_success(i18n.element_deleted)
                getAllMails();
                DELETE = '';
            }).fail(function (err) {
                HoldOn.close();
                notify_error(err.responseJSON.message);
                console.error(err);
                DELETE = '';
            });
            var container = i18n.no_templates_found
            $('#saved_message').html("<center><h3>" + container + "</h3></center>");
        });
    });

    $(document.body).on('click', '.choose_template', function () {
        let value = $(this).val();

        HoldOn.open()
        $.ajax({
            url: root_path + 'app/api/sms_gateway/' + _app_id_ + '/' + value,
            method: 'GET',
        }).done(function (data) {
            HoldOn.close();
            notify_success(i18n.element_deleted)

            $('#message').val(data.data.messageText);
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);

        });

    });
    console.log(_app_id_)
    await getAllMails()

    await getAllContacts()
    await getAllContacts_single()

    //await getallMessage()

    $('#add_group').click(function () {
        let body = {};
        body.name = $('#group_name').val()
        body.description = $('#group_description').val()
        if (body.name === '') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }
        if (body.description === '') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }
        HoldOn.open();
        $.post(root_path + 'app/api/contact_group/' + _app_id_, body, function (data) {
            HoldOn.close();
            getAllContacts()
            notify_success(data.message);
            $('#group_name').val('')
            $('#group_description').val('')
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        });

    });

    $('#add_contact').click(function () {
        let body = {};
        body.name = $('#contacts_name').val()
        body.lada = $('#lada').val()
        body.phone = $('#number').val()
        body.group = $('#contacts_group').val()
        if (body.name === '') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }
        if (body.email === '') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }
        HoldOn.open();
        $.post(root_path + 'app/api/contacts/phone/' + _app_id_, body, function (data) {
            HoldOn.close();
            getAllContacts_single()
            notify_success(data.message);
            $('#contacts_name').val('')
            $('#contacts_mail').val('')
            $('#contacts_group').val('-1')
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        });
    });


    $(document.body).on('click', '.delete_c_group', function () {
        let value = $(this).val();
        confirm_delete(function () {
            $('#saved_mails').html('');
            $.ajax({
                url: root_path + 'app/api/contact_group/' + _app_id_ + '/' + value,
                method: 'DELETE',
            }).done(function (data) {
                console.log("AQUI")
                HoldOn.close();
                notify_success(i18n.element_deleted)
                getAllContacts();

            }).fail(function (err) {
                HoldOn.close();
                notify_error(err.responseJSON.message);
                console.error(err);

            });
        });
    });
    $(document.body).on('click', '.delete_c', async function () {
        let value = $(this).val();
        confirm_delete(function () {
            $('#sp_for_contacts').html('');
            $.ajax({
                url: root_path + 'app/api/contacts/' + _app_id_ + '/' + value,
                method: 'DELETE',
            }).done(async function (data) {
                HoldOn.close();
                notify_success(i18n.element_deleted)
                await getAllContacts();

            }).fail(function (err) {
                HoldOn.close();
                notify_error(err.responseJSON.message);
                console.error(err);

            });
        });
    });
    $(document.body).on('click', '.choose_c_group', function () {
        let value = $(this).val();
        HoldOn.open();
        $('#sp_for_contacts').html('');
        $.getJSON(root_path + 'app/api/contacts/' + _app_id_, {
            where: {
                app: _app_id_,
                group: value
            }
        }, function (data) {
            HoldOn.close();
            notify_success(data.message);
            if (data.data.length > 0) {

                data.data.map(function (item, i) {
                    $('#sp_for_contacts').append('<div class="row">' +
                        '                    <div class="col-8">' +
                        '                      <button value="' + item._id + '" class="btn-link btn choose_c "><i class="fas fa-envelope"></i> ' + item.name + '</button>' +
                        '<br> <small> ' + item.lada + item.phone + ' </small>' +
                        '                    </div>' +
                        '                    <div class="col-4">' +
                        '                      <button value="' + item._id + '" class="btn btn-danger btn-sm btn-block"><i class="fas fa-trash"></i></button>' +
                        '                    </div>' +
                        '                  </div> <hr>');
                });
            }
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        });

    });

    $(document.body).on('click', '.choose_c', function () {
        let value = $(this).val();
        HoldOn.open();

        $.getJSON(root_path + 'app/api/contacts/' + _app_id_ + '/' + value, {
            where: {
                app: _app_id_,
            }
        }, function (data) {
            HoldOn.close();
            notify_success(data.message);
            let OP = $('#to').val();
            console.log(data.data.lada + data.data.phone)
            if (!OP.includes(data.data.lada + data.data.phone)) {
                OP = OP + ',' + data.data.lada + data.data.phone;
                OP = OP.split(',');
                OP = remove_empty(OP);
                OP = OP.join(',');
                $('#to').val(OP);
            } else {
                notify_warning(i18n.phone_already_included)
            }

        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        });
    });
    let remove_empty = function (array) {
        ne_array = [];
        array.map(function (item, i) {
            if (item && item !== '') {
                ne_array.push(item)
            }

        })
        return ne_array;
    }
});
$(document.body).on('click', '.choose_no_repeat', function () {
    let value = $(this).val();
    HoldOn.open();
    $.getJSON(root_path + 'app/api/contacts/' + _app_id_ + '/' + value, {
        where: {
            app: _app_id_,
        }
    }, function (data) {
        HoldOn.close();
        notify_success(data.message);
        let OP = $('#to').val();

        if (OP == '') {
            OP = OP + ',' + data.data.lada + data.data.phone;
            OP = OP.split(',');
            OP = remove_empty(OP);
            OP = OP.join(',');
            $('#to').val(OP);

        } else {
            OP = OP.split(',');

            var found = OP.find(element => element == data.data.lada + data.data.phone);

            if (!found) {
                OP = OP + ',' + data.data.lada + data.data.phone;
                OP = OP.split(',');
                OP = remove_empty(OP);
                OP = OP.join(',');
                $('#to').val(OP);
            } else {
                notify_warning(i18n.phone_already_included)
            }
        }

    }).fail(function (err) {
        HoldOn.close();
        notify_error(err.responseJSON.message);
        console.error(err);
    });
});
let remove_empty = function (array) {
    ne_array = [];
    array.map(function (item, i) {
        if (item && item !== '') {
            ne_array.push(item)
        }

    })
    return ne_array;
}


$(document.body).on('click', '.select_All', function () {
    HoldOn.open();
    let value = $(this).val();
    $('#to').val(null)

    $.getJSON(root_path + 'app/api/contacts/' + _app_id_ + '/', {
        where:
            {
                group: value
            }
    }, function (data) {

        let phones = $('#to').val();
        console.log(phones)

        data.data.map(function (item) {
            phones = phones + ',' + item.lada + item.phone
            phones = phones.split(',');
            phones = remove_empty(phones)
            phones = phones.join(',');
            $('#to').val(phones)
            console.log(item.group, item.email)
            HoldOn.close();
        })

    }).fail(function (err) {
        HoldOn.close();
        notify_error(err.responseJSON.message);
        console.error(err);
    });
    let remove_empty = function (array) {
        ne_array = [];
        array.map(function (item, i) {
            if (item && item !== '') {
                ne_array.push(item)
            }

        })
        return ne_array;
    }


})