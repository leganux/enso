$(document).ready(function () {
    $.fn.dataTable.ext.errMode = 'none';

    var uploadObj = $("#fileuploader").uploadFile({
        url: root_path + 'app/api/app_files/' + _app_id_ + '/upload',
        fileName: "file",
        multiple: true,
        maxFileCount: 10,
        previewWidth: '100%',
        statusBarWidth: '100%',
        dragdropWidth: '100%',
        afterUploadAll: function (obj) {

            $('#menu_g_file_manager').modal('hide');
            draw_datatable_rs(DT);
        }
    });

    var DT = $("#datatable").DataTable({
        "responsive": true,
        "data": {},
        "columns": [
            {
                "data": "_id"
            },
            {
                "data": "url",
                render: function (data) {
                    data = data.toLowerCase()
                    if (data.includes('.jpg')
                        || data.includes('.jpeg')
                        || data.includes('.png')
                        || data.includes('.gif')
                        || data.includes('.bmp')
                        || data.includes('.svg')
                    ) {
                        return '<img  class="img-fluid img-thumbnail" src="' + data + '"><br><input class="form-control" value="' + data + '">'

                    } else {
                        return '<input class="form-control" value="' + data + '">'
                    }
                }
            },
            {
                "data": "path",
                render: function (data) {
                    return '<input class="form-control" value="' + data + '">'
                }
            },
            {
                "data": "original_name"
            },
            {
                "data": "owner._id"
            },
            {
                "data": "createdAt"
            },
            {
                "data": "_id",
                render: function (data, v, row) {
                    return '<button value="' + data + '" class="btn bg-pink   dlete_file"><i class="fas fa-trash"></i></button>' +
                        '<a download="' + row.original_name + '"  href="' + row.url + '" class="btn btn-dark  "><i class="fas fa-download"></i></a>' +
                        '<a  target="_blank" href="' + row.url + '" class="btn btn-light  "><i class="fas fa-eye"></i></a>'
                }
            },
        ],
        processing: true,
        serverSide: true,
        ajax: {
            url: root_path + 'app/api/app_files/' + _app_id_ + '/datatable',
            type: "POST"
        },
    });


    draw_datatable_rs(DT);

    $('#btn_new_element').click(function () {
        $('#modal_new_edit').modal('show');
        uploadObj.reset();
    });

    $('#save_changes').click(function () {
        $('#modal_new_edit').modal('hide');
    });


    $(document.body).on('click', '.dlete_file', function () {
        let DELETE = $(this).val();
        confirm_delete(function () {
            $.ajax({
                url: root_path + 'app/api/app_files/' + _app_id_ + '/' + DELETE,
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


});