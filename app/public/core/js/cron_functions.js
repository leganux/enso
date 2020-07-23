$(document).ready(function () {
    $.fn.dataTable.ext.errMode = 'none';
    var editor = CodeMirror.fromTextArea(document.getElementById("in_content"), {
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true
    });
    editor.setOption("theme", 'dracula');
    $(document.body).on('click', '.copy_me', function () {
        let id = $(this).attr('id');
        copy_clipboard(id)
    })
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
                "data": "description"
            },
            {
                "data": "minute"
            },
            {
                "data": "hour"
            },
            {
                "data": "day_of_mont"
            },
            {
                "data": "day_of_week"
            },
            {
                "data": "month_of_year"
            },
            {
                "data": "content"
            }, {
                "data": "cron_string"
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
            url: root_path + 'app/api/cron_functions/' + _app_id_ + '/datatable',
            type: "POST"
        },
    });
    draw_datatable_rs(DT);
    $('#btn_new_element').click(function () {
        $('#modal_new_edit').modal('show');
        $('#in_name').val('');
        $('#in_description').val('');
        $('#in_minute').val('');
        $('#in_hour').val('');
        $('#in_day_of_month').val('');
        $('#in_day_of_week').val('');
        $('#in_month_of_year').val('');
        $('#in_cron_string').val('* * * * *');

        editor.setValue(`//Example function
async function () {
  try{
 let  A = 5  ;
  let  B = 7  ;
   var response ={message:'The result is', response : A+ B};  
   console.log(response);
 
  }catch(e){
  console.error(e)
     
  };
 
}`);
        UPDATE = ''
    });

    $('#save_changes').click(function () {
        let body = {};
        body.name = $('#in_name').val()
        body.description = $('#in_description').val()
        body.minute = $('#in_minute').val()
        body.hour = $('#in_hour').val()
        body.day_of_mont = $('#in_day_of_month').val()
        body.day_of_week = $('#in_day_of_week').val()
        body.month_of_year = $('#in_month_of_year').val()
        body.cron_string = $('#in_cron_string').val()

        body.content = editor.getValue()

        if (body.name === '') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }

        save_data_api(root_path + 'app/api/cron_functions/' + _app_id_, body, UPDATE, function () {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_new_edit').modal('hide');
            $('#btn_build_function').click()
        });
    });
    $(document.body).on('change', '.actived_element', function () {
        UPDATE = $(this).val();
        var isChecked = $(this).prop('checked');
        save_data_api(root_path + 'app/api/cron_functions/' + _app_id_, {active: isChecked}, UPDATE, function () {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_new_edit').modal('hide');
            $('#btn_build_function').click()
        });
    });
    $(document.body).on('click', '.update_element', function () {
        UPDATE = $(this).val();
        $.getJSON(root_path + 'app/api/cron_functions/' + _app_id_ + '/' + UPDATE, {}, function (data) {
            $('#modal_new_edit').modal('show');
            $('#in_name').val(data.data.name);
            $('#in_description').val(data.data.description);
            $('#in_minute').val(data.data.minute);
            $('#in_hour').val(data.data.hour);
            $('#in_day_of_month').val(data.data.day_of_mont);
            $('#in_day_of_week').val(data.data.day_of_week);
            $('#in_month_of_year').val(data.data.month_of_year);
            $('#in_cron_string').val(data.data.cron_string);


            editor.setValue(data.data.content);
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
                url: root_path + 'app/api/cron_functions/' + _app_id_ + '/' + DELETE,
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
    snakeThis('#in_name');


    $('#btn_build_function').click(function () {
        HoldOn.open();
        $.post(root_path + 'app/api/cron_functions/rebuild/' + _app_id_, function (data) {
            HoldOn.close();
            notify_success(data.message);
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        });
    });

    $('#build_cron_string').click(function () {
        let body = {};
        body.minute = $('#in_minute').val()
        body.hour = $('#in_hour').val()
        body.day_of_mont = $('#in_day_of_month').val()
        body.day_of_week = $('#in_day_of_week').val()
        body.month_of_year = $('#in_month_of_year').val()

        HoldOn.open();
        $.post(root_path + 'app/api/cron_functions/make_cron_string/' + _app_id_, body, function (data) {
            HoldOn.close();
            notify_success(data.message);
            $('#in_cron_string').val(data.data)
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        });
    });


});