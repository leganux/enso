$(document).ready(function () {
    $.fn.dataTable.ext.errMode = 'none';


    $('#in_content').summernote({
        placeholder: i18n.insert_your_content_here,
        //airMode: true,
        tabsize: 2,
        height: 300,
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture', 'video']],
            ['view', ['fullscreen', 'codeview', 'help']]
        ],
        dialogsInBody: true
    });

    var $summernote = $('#in_content');

    var UPDATE = '';
    var DT = $("#datatable").DataTable({
        "responsive": true,
        "data": {},
        "columns": [
            {
                "data": "_id"
            },
            {
                "data": "language.name"
            },
            {
                "data": "reference"
            },
            {
                "data": "content",
                render: function (data, v, row) {
                    return stripHtml(data).substring(0, 300) + '...';
                }
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
            url: root_path + 'api/i18n/dynamic_content/datatable',
            type: "POST"
        },
    });


    draw_datatable_rs(DT);

    $('#btn_new_element').click(function () {
        $('#modal_new_edit').modal('show');
        $('#in_language').val('-1');
        $('#in_reference').val('');
        $summernote.summernote('code', '');

    });

    $('#save_changes').click(function () {
        let body = {};
        body.language = $('#in_language').val()
        body.reference = $('#in_reference').val().trim()

        if ($summernote.summernote('isEmpty')) {
            notify_warning(i18n.fill_all_fields)
            return false;
        }
        body.content = $summernote.summernote('code');

        if (body.language == '-1' || body.reference === '') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }
        save_data_api(root_path + 'api/i18n/dynamic_content', body, UPDATE, function () {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_new_edit').modal('hide');
        });
    });

    $(document.body).on('change', '.actived_element', function () {
        UPDATE = $(this).val();
        var isChecked = $(this).prop('checked');
        save_data_api(root_path + 'api/i18n/dynamic_content', {active: isChecked}, UPDATE, function () {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_new_edit').modal('hide');
        });
    });

    $(document.body).on('click', '.update_element', function () {
        UPDATE = $(this).val();
        $.getJSON(root_path + 'api/i18n/dynamic_content/' + UPDATE, {}, function (data) {
            $('#modal_new_edit').modal('show');
            $('#in_language').val(data.data.language._id);
            $('#in_reference').val(data.data.reference);
            $summernote.summernote('code', data.data.content);
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
                url: root_path + 'api/i18n/dynamic_content/' + DELETE,
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

    charge_select('#in_language', {where: {active: true}}, root_path + 'api/i18n/language_list', '_id', 'name');
    snakeThis('#in_reference')

});