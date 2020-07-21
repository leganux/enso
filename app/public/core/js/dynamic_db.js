var UPDATE = '';
var UPDATE_DATA = '';
var DATA_DB_NAME = '';
var UPDATEstr = '';
var STRUCTURE = '';
var DATA = '';
var LIST_OF_FIELDS = [];
var LIST_OF_FIELDS_MANDATORY = [];
var DATA_OBJECT_FIELDS = [];
var DT_data = {};


$(document).ready(function () {
    $.fn.dataTable.ext.errMode = 'none';

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
                "data": "name",
                render: function (data, v, roow) {
                    return '<input ident="' + roow._id + '" id="cpy_' + roow._id + '" class="copy_me form-control" type="text" readonly value="' + root_path + 'app/api/db/data/' + _app_id_ + '/' + data + '">';
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
                        '<button value="' + data + '" class="btn btn-danger btn-block delete_element"> <i class="fas fa-trash"></i></button>' +
                        '<button value="' + data + '" class="btn btn-primary btn-block structure_element"> <i class="fas fa-border-none"></i></button>' +
                        '<button value="' + data + '" class="btn btn-default btn-block data_element"> <i class="fas fa-database"></i></button>';


                }
            }

        ],
        processing: true,
        serverSide: true,
        ajax: {
            url: root_path + 'app/api/db/collection/' + _app_id_ + '/datatable',
            type: "POST"
        },
    });
    draw_datatable_rs(DT);

    $(document.body).on('click', '.copy_me', function () {
        let id = $(this).attr('id');
        copy_clipboard(id)
    })

    $('#btn_new_element').click(function () {
        $('#modal_new_edit').modal('show');
        $('#in_name').val('');
        $('#in_description').val('');
    });

    snakeThis('#in_name');

    $('#save_changes').click(function () {
        let body = {};
        body.name = $('#in_name').val().trim();

        body.description = $('#in_description').val().trim();


        if (body.name === '' || body.description === '') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }


        save_data_api(root_path + 'app/api/db/collection/' + _app_id_, body, UPDATE, function () {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_new_edit').modal('hide');
        });
    });

    $(document.body).on('change', '.actived_element', function () {
        UPDATE = $(this).val();
        var isChecked = $(this).prop('checked');
        save_data_api(root_path + 'app/api/db/collection/' + _app_id_, {active: isChecked}, UPDATE, function () {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_new_edit').modal('hide');
        });
    });

    $(document.body).on('click', '.update_element', function () {
        UPDATE = $(this).val();
        $.getJSON(root_path + 'app/api/db/collection/' + _app_id_ + '/' + UPDATE, {}, function (data) {
            $('#modal_new_edit').modal('show');
            $('#in_name').val(data.data.name);
            $('#in_description').val(data.data.description);
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
                url: root_path + 'app/api/db/collection/' + _app_id_ + '/' + DELETE,
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

    $('#tab_tables').click(function () {
        $('#tab_structure').addClass('disabled')
        $('#tab_data').addClass('disabled')
    })

    let get_structure = function (id) {
        HoldOn.open();
        let url = root_path + 'app/api/db/collection/' + _app_id_ + '/' + id;
        $.get(url, {}, function (data) {
            HoldOn.close();
            notify_success(data.message);
            if (data.data && data.data.fields) {
                draw_datatable_local(data.data.fields, DTstr)
            }
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        });
    }

    $(document.body).on('click', '.structure_element', function () {
        STRUCTURE = $(this).val();
        $('#tab_structure').removeClass('disabled').click();
        get_structure(STRUCTURE);
        charge_select('#in_str_related', {where: {active: true}}, root_path + 'app/api/db/collection/' + _app_id_, '_id', 'name');
    });


    var DTstr = $("#datatable_st").DataTable({
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
                "data": "kind",

            },
            {
                "data": "related",

            },
            {
                "data": "mandatory",
                render: function (data, v, row) {
                    if (data) {
                        return '<cente><input value="' + row._id + '" type="checkbox" class="mandatory_element" checked></cente>'
                    } else {
                        return '<cente><input value="' + row._id + '" type="checkbox" class="mandatory_element" ></cente>'
                    }
                }

            },
            {
                "data": "default",

            },
            {
                "data": "default_type",

            },
            {
                "data": "default_custom",

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
                    return '<button value="' + data + '" class="btn btn-dark btn-block update_element_str"> <i class="fas fa-edit"></i></button>' +
                        '<button value="' + data + '" class="btn btn-danger btn-block delete_element_str"> <i class="fas fa-trash"></i></button>';
                }
            }

        ],
        processing: false,
    });

    $('#btn_new_element_str').click(function () {
        $('#modal_new_edit_str').modal('show');
        $('#in_str_name').val('');
        $('#in_str_description').val('');
        $('#in_str_kind').val('string');
        $('#in_str_related').val('');
        $('#in_str_mandatory').val('false');
        $('#in_str_default').val('false');
        $('#SP_dft_').hide();
        $('#in_str_default_type').val('timestamp');
        $('#in_str_custom').val('');
        UPDATEstr = '';
    });

    $('#in_str_default').change(function () {
        if ($(this).val() == 'true') {
            $('#SP_dft_').show();
        } else {
            $('#SP_dft_').hide();
        }
    })

    $('#save_changes_str').click(function () {
        let body = {};
        body.name = $('#in_str_name').val().trim();
        body.description = $('#in_str_description').val();
        body.kind = $('#in_str_kind').val().trim();
        body.related = $('#in_str_related').val();
        body.mandatory = $('#in_str_mandatory').val() == 'true';
        body.default = $('#in_str_default').val() == 'true';
        body.default_type = $('#in_str_default_type').val();
        body.defult_custom = $('#in_str_custom').val();
        body.app = _app_id_


        if (body.name === '' || body.description === '') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }

        if (UPDATEstr === '') {
            save_data_api(root_path + 'app/api/db/collection/field/' + STRUCTURE + '/' + _app_id_, body, '', function () {
                get_structure(STRUCTURE)
                $('#modal_new_edit_str').modal('hide');
                UPDATEstr = ''
            });
        } else {
            save_data_api(root_path + 'app/api/db/structure/' + _app_id_, body, UPDATEstr, function () {
                get_structure(STRUCTURE)
                $('#modal_new_edit_str').modal('hide');
            });
            UPDATEstr = ''
        }


    });

    snakeThis('#in_str_name');


    $(document.body).on('click', '.update_element_str', function () {
        UPDATEstr = $(this).val();
        $.getJSON(root_path + 'app/api/db/structure/' + _app_id_ + '/' + UPDATEstr, {}, function (data) {
            $('#modal_new_edit_str').modal('show');
            $('#in_str_name').val(data.data.name);
            $('#in_str_description').val(data.data.description);
            $('#in_str_kind').val(data.data.kind);
            $('#in_str_related').val(data.data.related);
            $('#in_str_mandatory').val(String(data.data.mandatory));
            $('#in_str_default').val(String(data.data.default));
            if (eval(data.data.default)) {
                $('#in_str_default_type').val(data.data.default_type)
                $('#in_str_custom').val(data.data.defult_custom)
            }
            HoldOn.close();
            notify_success(data.message);
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        });
    });

    $(document.body).on('click', '.delete_element_str', function () {
        let DELETE = $(this).val();
        confirm_delete(function () {
            $.ajax({
                url: root_path + 'app/api/db/structure/' + _app_id_ + '/' + DELETE,
                method: 'DELETE',
            }).done(function (data) {
                HoldOn.close();
                notify_success(i18n.element_deleted)
                get_structure(STRUCTURE)
                DELETE = '';
            }).fail(function (err) {
                HoldOn.close();
                notify_error(err.responseJSON.message);
                console.error(err);
                DELETE = '';
            });
        });

    });


    $(document.body).on('change', '.mandatory_element', function () {
        UPDATE = $(this).val();
        var isChecked = $(this).prop('checked');
        save_data_api(root_path + 'app/api/db/structure/' + _app_id_, {mandatory: isChecked}, UPDATE, function () {
            get_structure(STRUCTURE)
            UPDATE = '';

        });
    });

    $('#btn_rebuild').click(function () {
        HoldOn.open();
        $.post(root_path + 'app/api/db/collection/rebuild/' + _app_id_, function (data) {

            HoldOn.close();
            notify_success(data.message);
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        });
    });

    let get_data_from_DB = function (id) {
        HoldOn.open();
        $.getJSON(root_path + 'app/api/db/collection/' + _app_id_ + '/' + id, {}, function (datas) {
            HoldOn.open();

            $.getJSON(root_path + 'app/api/db/data/' + _app_id_ + '/' + datas.data.name, {}, function (data) {

                HoldOn.close();
                draw_datatable_local(data.data, DT_data)

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
    }

    // data element
    $(document.body).on('click', '.data_element', function () {
        DATA = $(this).val();
        $('#tab_data').removeClass('disabled').click();
        HoldOn.open()

        $.getJSON(root_path + 'app/api/db/collection/' + _app_id_ + '/' + DATA, {}, function (data) {
            HoldOn.close()
            $('#datatable_data_fields').html('<th>' + i18n.id + '</th>')
            $('#space_fields').html('')
            let fields_columns = [];
            fields_columns.push({"data": "_id"});

            DATA_OBJECT_FIELDS = data.data;
            DATA_DB_NAME = data.data.name;

            data.data.fields.map(async (item, i) => {
                LIST_OF_FIELDS.push(item.name);

                if (eval(item.mandatory)) {
                    LIST_OF_FIELDS_MANDATORY.push(item.name);
                }


                $('#datatable_data_fields').append('<th>' + item.name + '</th>')
                fields_columns.push({"data": item.name})
                $('#space_fields').append('<br><label>' + item.name + '</label>')
                switch (item.kind) {
                    case 'string':
                        $('#space_fields').append('<br><input type="text"  id="element_data_' + item.name + '" class="form-control"> ')
                        break;
                    case 'number':
                        $('#space_fields').append('<br><input type="number"  id="element_data_' + item.name + '" class="form-control"> ')
                        break;
                    case 'boolean':
                        $('#space_fields').append('<br><select  id="element_data_' + item.name + '" class="form-control"><option value="true">true</option> <option value="false">false</option></select> ')

                        break;
                    case 'date':
                        $('#space_fields').append('<br><input type="date"  id="element_data_' + item.name + '" class="form-control"> ')
                        break;
                    case 'buffer':
                        $('#space_fields').append('<br><textarea rows="5"  id="element_data_' + item.name + '" class="form-control"> </textarea>')
                        break;
                    case 'mixed':
                        $('#space_fields').append('<br><textarea rows="5"  id="element_data_' + item.name + '" class="form-control"> </textarea>')
                        break;
                    case 'array':
                        $('#space_fields').append('<br><textarea rows="5"  id="element_data_' + item.name + '" class="form-control"> </textarea>')
                        break;
                    case 'oid_array':
                        $('#space_fields').append('<br><input placeholder="Coma separated (,) ID  "  id="element_data_' + item.name + '" class="form-control"> ')
                        break;
                    case 'oid_single':
                        $('#space_fields').append('<br><input  placeholder="ID" id="element_data_' + item.name + '" class="form-control"> ')
                        break;
                }

            });

            $('#datatable_data_fields').append('<th>' + i18n.actions + '</th>')
            fields_columns.push({
                data: "_id",
                render: function (data, v, row) {
                    return '<button value="' + data + '" class="btn btn-dark btn-block update_element_dta"> <i class="fas fa-edit"></i></button>' +
                        '<button value="' + data + '" class="btn btn-danger btn-block delete_element_dta"> <i class="fas fa-trash"></i></button>';
                }
            })

            try {
                DT_data.destroy();
                DT_data = $("#datatable_data").DataTable({
                    "responsive": true,
                    "data": {},
                    "columns": fields_columns,
                });
            } catch (e) {
                console.info('Destroyed !!');
                DT_data = $("#datatable_data").DataTable({
                    "responsive": true,
                    "data": {},
                    "columns": fields_columns,
                });
            }


            get_data_from_DB(DATA)

        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        });
    });


    $('#btn_new_element_data').click(function () {
        $('#modal_new_edit_data').modal('show');
        LIST_OF_FIELDS.map(function (item, i) {
            $('#element_data_' + item).val('')
        });

    });

    $('#save_changes_data').click(function () {
        let arr_mnd = LIST_OF_FIELDS_MANDATORY.map(function (item, i) {
            if ($('#element_data_' + item).val() == '') {
                notify_warning(i18n.fill_all_fields)
                return 0;
            } else {
                return 1;
            }
        });
        if (arr_mnd.includes(0)) {
            return false;
        }

        let body = {};

        LIST_OF_FIELDS.map(function (item, i) {
            body[item] = $('#element_data_' + item).val()
        });

        console.log('BODY', body)
        if (UPDATE_DATA !== '') {   //update
            HoldOn.open()
            save_data_api(root_path + 'app/api/db/data/' + _app_id_ + '/' + DATA_DB_NAME, body, UPDATE_DATA, function () {
                HoldOn.close()
                $('#modal_new_edit_data').modal('hide');
                get_data_from_DB(DATA)
            })
        } else {//new
            HoldOn.open()
            $.post(root_path + 'app/api/db/data/' + _app_id_ + '/' + DATA_DB_NAME, body, function (data) {
                console.log('newData', data);
                $('#modal_new_edit_data').modal('hide')
                HoldOn.close()
                get_data_from_DB(DATA)
            }).fail(function (err) {
                HoldOn.close();
                notify_error(err.responseJSON.message);
                console.error(err);
            });
        }

    });

    $(document.body).on('click', '.update_element_dta', function () {
        UPDATE_DATA = $(this).val();
        HoldOn.open()
        $.getJSON(root_path + 'app/api/db/data/' + _app_id_ + '/' + DATA_DB_NAME + '/' + UPDATE_DATA, {}, function (data) {
            HoldOn.close()

            $('#modal_new_edit_data').modal('show');

            DATA_OBJECT_FIELDS.fields.map(function (item, i) {
                if (item.kind == 'boolean') {
                    $('#element_data_' + item.name).val(data.data[item.name].toString());
                } else if (item.kind == 'date') {
                    $('#element_data_' + item.name).val(moment(data.data[item.name]).format('YYYY-MM-DD'));
                } else {
                    $('#element_data_' + item.name).val(data.data[item.name]);
                }

            })


        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
            DELETE = '';
        });

    })

    $(document.body).on('click', '.delete_element_dta', function () {
        let DELETE = $(this).val();
        confirm_delete(function () {
            $.ajax({
                url: root_path + 'app/api/db/data/' + _app_id_ + '/' + DATA_DB_NAME + '/' + DELETE,
                method: 'DELETE',
            }).done(function (data) {
                HoldOn.close();
                notify_success(i18n.element_deleted)
                get_data_from_DB(DATA)
                DELETE = '';
            }).fail(function (err) {
                HoldOn.close();
                notify_error(err.responseJSON.message);
                console.error(err);
                DELETE = '';
            });
        });
    })


});