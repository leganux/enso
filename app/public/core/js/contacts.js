$(document).ready(function(){
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
                "data": "email"
            },
            {
                "data": "description"
            },
            {
                "data": "lada"
            },
            {
                "data": "phone"
            },
            {
                "data": "group_name"
            },
            {
                "data": "country"
            },
            {
                "data": "state"
            }, 
            {
                "data": "city"
            },
            {
                "data": "cp",
            },
            {
                "data": "street",
                render: function (data, v, row) {
                    return moment(data).format('DD/MM/YYYY h:mm:ss')
                }

            },
            {
                "data": "ext_number",
                render: function (data, v, row) {
                    return moment(data).format('DD/MM/YYYY h:mm:ss')
                }

            },
            {
                "data": "int_number",
                render: function (data, v, row) {
                    return moment(data).format('DD/MM/YYYY h:mm:ss')
                }

            },
            {
                "data": "reference",
                render: function (data, v, row) {
                    return moment(data).format('DD/MM/YYYY h:mm:ss')
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
});