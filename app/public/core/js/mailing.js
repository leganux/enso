$(document).ready(function () {
    $('#content_html').summernote({
        height: 400,
    });

    $('#btn_save').click(function () {
        let body = {};
        body.subject = $('#subject').val();
        if (body.subject === '') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }

        if ($('#content_html').summernote('isEmpty')) {
            notify_warning(i18n.fill_all_fields)
            return false;
        }
        body.content = $('#content_html').summernote('code');

        HoldOn.open();
        $.post(root_path + 'app/api/mailing/' + _app_id_, body, function (data) {
            HoldOn.close();
            getAllMails();
            notify_success(data.message)
            $('#content_html').summernote('code', '');
            $('#subject').val('');
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
            DELETE = '';
        });

    });

    let getAllMails = function () {
        HoldOn.open();
        $.getJSON(root_path + 'app/api/mailing/' + _app_id_, {where: {app: _app_id_}}, function (data) {
            HoldOn.close();
            notify_success(data.message);
            if (data.data.length > 0) {
                $('#saved_mails').html('');
                data.data.map(function (item, i) {
                    $('#saved_mails').append('<div class="row">' +
                        '                    <div class="col-8">' +
                        '                      <button value="' + item._id + '" class="btn-link btn choose_template"><i class="fas fa-envelope"></i> ' + item.subject + '</button>' +
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
                        '<br> <small class="pl-3"> ' + item.email + ' </small>' +
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
            $('#saved_mails').html('');
            $.ajax({
                url: root_path + 'app/api/mailing/' + _app_id_ + '/' + value,
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
        });
    });

    $(document.body).on('click', '.choose_template', function () {
        let value = $(this).val();

        HoldOn.open()
        $.ajax({
            url: root_path + 'app/api/mailing/' + _app_id_ + '/' + value,
            method: 'GET',
        }).done(function (data) {
            HoldOn.close();
            notify_success(i18n.element_deleted)

            $('#subject').val(data.data.subject);
            $('#content_html').summernote('code', data.data.content);
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);

        });

    });

    getAllMails()
    getAllContacts()
    getAllContacts_single()

    $('#btn_send').click(function () {


    });

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
        body.email = $('#contacts_mail').val()
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
        $.post(root_path + 'app/api/contacts/' + _app_id_, body, function (data) {
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

    //charge_select('#contacts_group', {where: {app: _app_id_}}, root_path + 'app/api/contact_group/' + _app_id_, '_id', 'name')

    $(document.body).on('click', '.delete_c_group', function () {
        let value = $(this).val();
        confirm_delete(function () {
            $('#saved_mails').html('');
            $.ajax({
                url: root_path + 'app/api/contact_group/' + _app_id_ + '/' + value,
                method: 'DELETE',
            }).done(function (data) {
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
    $(document.body).on('click', '.delete_c_group', function () {
        let value = $(this).val();
        confirm_delete(function () {
            $('#saved_mails').html('');
            $.ajax({
                url: root_path + 'app/api/contact_group/' + _app_id_ + '/' + value,
                method: 'DELETE',
            }).done(function (data) {
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
                        '<br> <small> ' + item.email + ' </small>' +
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
            OP = OP + ',' + data.data.email;
            OP = OP.split(',');
            OP = remove_empty(OP);
            OP = OP.join(',');
            $('#to').val(OP);
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
        console.log(OP);
        if(OP == ''){
            OP = OP + ',' + data.data.email;
            OP = OP.split(',');
            OP = remove_empty(OP);
            OP = OP.join(',');
            $('#to').val(OP);
            console.log("op diferente de vacio")
        }else{
            OP = OP.split(',');
            console.log(OP)
            console.log(data.data.email)
            var found = OP.find(element => element == data.data.email);
            console.log(found)

            if(!found){
                OP = OP + ',' + data.data.email;
                OP = OP.split(',');
                OP = remove_empty(OP);
                OP = OP.join(',');
                $('#to').val(OP);
            }else{
                notify_warning(i18n.email_already_include)
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
        
        $.getJSON(root_path + 'app/api/contacts/' + _app_id_ + '/',{ 
            where: 
            { 
                group : value
            }
        }, function (data) {
           
           let mails = $('#to').val();
           console.log(mails)

           data.data.map(function(item){        
                mails = mails + ',' +item.email
                mails = mails.split(',');
                mails = remove_empty(mails)
                mails = mails.join(',');
                $('#to').val(mails)
                console.log(item.group,item.email)
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

});