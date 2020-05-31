$(document).ready(function () {
    $.fn.dataTable.ext.errMode = 'none';

    var uploadObj = $("#fileuploader").uploadFile({
        url: root_path + 'api/core/cdn/zip_uploader',
        fileName: "file",
        multiple: false,
        maxFileCount: 1,
        acceptFiles: "zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed",
        afterUploadAll: function (obj) {
            $('#btn_scan').click()
            $('#modal_new_edit').modal('hide');
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
                "data": "url"
            },
            {
                "data": "path"
            },
            {
                "data": "type"
            },
        ],
        processing: true,
        serverSide: true,
        ajax: {
            url: root_path + 'api/core/cdn/datatable',
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

    $('#btn_scan').click(function () {
        HoldOn.open()
        $.post(root_path + 'api/core/cdn/scan_folder', {}, function (data) {
            HoldOn.close();
            draw_datatable_rs(DT);
            notify_success(data.message);
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        });
    })


});