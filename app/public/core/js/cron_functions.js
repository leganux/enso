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
                "data": "content"
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
            url: root_path + 'app/api/cloud_functions/' + _app_id_ + '/datatable',
            type: "POST"
        },
    });
    draw_datatable_rs(DT);
    $('#btn_new_element').click(function () {
        $('#modal_new_edit').modal('show');
        $('#in_name').val('');
        $('#in_description').val('');
        $('#in_method').val('POST');
        editor.setValue(`//Example function
async function (req, res) {
  try{
   var response ={message:'The result is', response : Number(req.body.a) + Number(req.body.b)};  
  res(null, response );
  }catch(e){
  console.error(e)
     res(e, null );
  };
 
}`);
        UPDATE = ''
    });

    $('#save_changes').click(function () {
        let body = {};
        body.name = $('#in_name').val()
        body.description = $('#in_description').val()
        body.method = $('#in_method').val()
        body.content = editor.getValue()

        if (body.name === '') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }

        save_data_api(root_path + 'app/api/cloud_functions/' + _app_id_, body, UPDATE, function () {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_new_edit').modal('hide');
            $('#btn_build_function').click()
        });
    });
    $(document.body).on('change', '.actived_element', function () {
        UPDATE = $(this).val();
        var isChecked = $(this).prop('checked');
        save_data_api(root_path + 'app/api/cloud_functions/' + _app_id_, {active: isChecked}, UPDATE, function () {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_new_edit').modal('hide');
        });
    });
    $(document.body).on('click', '.update_element', function () {
        UPDATE = $(this).val();
        $.getJSON(root_path + 'app/api/cloud_functions/' + _app_id_ + '/' + UPDATE, {}, function (data) {
            $('#modal_new_edit').modal('show');
            $('#in_name').val(data.data.name);
            $('#in_description').val(data.data.description);
            $('#in_method').val(data.data.method);
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
                url: root_path + 'app/api/cloud_functions/' + _app_id_ + '/' + DELETE,
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
        $.post(root_path + 'app/api/cloud_functions/rebuild/' + _app_id_, function (data) {
            HoldOn.close();
            notify_success(data.message);
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        });
    })

});