$(document).ready(function () {
    $.fn.dataTable.ext.errMode = 'none';
    var UPDATE = '';
    var UPDATEPARAM = '';

    $('[data-toggle="tooltip"]').tooltip()
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
                "data": "url"
            },
            {
                "data": "urltwo"
            },
            {
                "data": "urlthree"
            },
            {
                "data": "method"
            },
            {
                "data": "params",
                render: function (data, v, row) {
                    if (data) {
                        let ides = data.map((item, i) => {
                            return " <br> " + i18n.param + " : " + item._id + " <br> " + i18n.name + " : " + item.name + " <br> " + i18n.description + " : " + item.description + " <br> " + i18n.format + " : " + item.format +
                                " <br> " + i18n.default + " : " + item.default + " <br> " + i18n.type + " : " + item.paramtype.name + " <br> " + i18n.description + " : " + item.paramtype.description +
                                " <br> " + i18n.key + " : " + item.paramtype.key +
                                '<button style="max-width:80%" value="' + item._id + '" class="btn btn-primary btn-block btn_edit_param" data-toggle="tooltip" data-placement="right" title="Edit param"> <i class="fas fa-pen-square"></i></button>' +
                                '<button style="max-width:80%" value="' + item._id + '" class="btn btn-danger btn-block btn_delete_param" data-toggle="tooltip" data-placement="right" title="Delete param"> <i class="fas fa-trash"></i></button>';

                        })
                        return ides.join(" ")
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
                    return '<button value="' + data + '" class="btn btn-warning btn-block play_element  data-toggle="tooltip" data-placement="right" title="Execute webservice"> <i class="fas fa-play"></i></button>' +
                        '<button value="' + data + '" class="btn btn-success btn-block btn_new_param" data-toggle="tooltip" data-placement="right" title="New param"> <i class="fas fa-swatchbook"></i></button>' +
                        '<button value="' + data + '" class="btn btn-primary btn-block update_element" data-toggle="tooltip" data-placement="right" title="Edit webservice"> <i class="fas fa-edit"></i></button>' +
                        '<button value="' + data + '" class="btn btn-danger btn-block delete_element" data-toggle="tooltip" data-placement="right" title="Delete webservice"> <i class="fas fa-trash"></i></button>';


                }
            }

        ],
        processing: true,
        serverSide: true,
        ajax: {
            url: root_path + 'app/api/webservice/' + _app_id_ + '/datatable',
            type: "POST"
        },
    });
    draw_datatable_rs(DT);
    $("#in_method").select2()
    $("#in_format").select2()
    $("#in_type").select2()
    $("#in_type_edit").select2()
    $("#in_format_edit").select2()
    $('.select2-selection').css("height", "40px")


    async function getypes() {
        $("#in_type_key").html("")
        /**
         * TODO: Arreglar Crud con rutas de type
         */
        try {
            let response = await fetch(root_path + 'api/core/type', {})
            let data = await response.json()

            console.log(data.data)
            for (let i = 0; i < data.data.length; i++) {
                let option = document.createElement("option")
                option.title = data.data[i]._id
                option.value = data.data[i].key
                option.text = data.data[i].name
                $("#in_type_key").append(option)
            }
            $("#in_type_key").select2()
            $('.select2-selection').css("height", "40px")
            $("#in_type_key").change()
            HoldOn.close();
        } catch (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        }
    }

    async function getypefull(id) {
        typeid = Number(id)
        $("#in_type_name").val("")
        try {
            let response = await fetch(root_path + 'api/core/type/' + '?where[key]=' + typeid, {})
            let data = await response.json()
            $("#in_type_name").attr("disabled", "disabled")
            $("#in_type_description").attr("disabled", "disabled")
            $("#in_type_name").val(data.data[0].name)
            $("#in_type_description").val(data.data[0].description)

        } catch (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        }
    }

    $('#in_type_key').change(async function () {
        let id = $(this).select2('data')[0].id
        await getypefull(id)
    })
    $('#in_type_key_edit').change(async function () {
        let id = $(this).select2('data')[0].id
        await getypefull_edit(id)
    })

    async function getypes_edit() {
        $("#in_type_key_edit").html("")
        /**
         * TODO: Arreglar Crud con rutas de type
         */
        try {
            let response = await fetch(root_path + 'api/core/type', {})
            let data = await response.json()

            for (let i = 0; i < data.data.length; i++) {
                let option = document.createElement("option")
                option.title = data.data[i]._id
                option.value = data.data[i].key
                option.text = data.data[i].name
                $("#in_type_key_edit").append(option)
            }
            $("#in_type_key_edit").select2()
            $('.select2-selection').css("height", "40px")
            $("#in_type_key_edit").change()
            HoldOn.close();
        } catch (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        }
    }

    async function getypefull_edit(id) {
        typeid = Number(id)
        $("#in_type_name_edit").val("")
        try {
            let response = await fetch(root_path + 'api/core/type/' + '?where[key]=' + typeid, {})
            let data = await response.json()
            $("#in_type_name_edit").attr("disabled", "disabled")
            $("#in_type_description_edit").attr("disabled", "disabled")
            $("#in_type_name_edit").val(data.data[0].name)
            $("#in_type_description_edit").val(data.data[0].description)

        } catch (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        }
    }

    $('#btn_new_element').click(function () {
        $('#modal_new_edit').modal('show');
        $('#in_name').val('');
        $('#in_description').val('');
        $('#in_url').val('');
        $('#in_url2').val('');
        $('#in_url3').val('');
        $('#in_param_name').val('');
        $('#in_param_description').val('');
        $('#in_param_default').val('');
        $('#in_type_name').val('');
        $('#in_type_description').val('');
        $('#in_type_key').val('');
        $('#in_method').val("non")
        $('#in_method').trigger("change")
        $('#in_format').val("non")
        $('#in_format').trigger("change")
        UPDATE = ''
    });


    $(document.body).on('click', '.btn_new_param', async function () {
        let value = $(this).val()
        $('#modal_new_param').modal('show');
        $('#in_webservice ').val(value);
        $('#in_param_name').val('');
        $('#in_param_description').val('');
        $('#in_param_default').val('');
        $('#in_param_default_area').val('');
        await getypes()

        $('#in_format').val("non")
        $('#in_format').trigger("change")

        UPDATE = ''

    });


    $("#save_changes").click(async function () {
        let body = {};

        body.name = $('#in_name').val();
        body.description = $('#in_description').val();
        body.url = $('#in_url').val();
        body.urltwo = $('#in_url2').val();
        body.urlthree = $('#in_url3').val();
        body.method = $('#in_method').select2('data')[0].id

        if (body.name === '') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }

        await save_data_api(root_path + 'app/api/webservice/' + _app_id_, body, UPDATE, function (data) {
            draw_datatable_rs(DT);
            UPDATE = '';
            $('#modal_new_edit').modal('hide');
            $('#btn_build_function').click()
            HoldOn.close();
            console.log("webservice guardado")
            notify_success(data.message);
        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);

        });
        ;


    })

    $("#save_changes_params").click(async function () {
        let body = {};
        let params = {};
        let format = $('#in_format').select2('data')[0].id

        body.id = $('#in_webservice').val();

        params.name = $('#in_param_name').val();
        params.description = $('#in_param_description').val();
        params.format = $('#in_format').select2('data')[0].id

        console.log(format)
        if (format == "String") {
            params.default = $('#in_param_default').val();
        } else if (format == "Object" || format == "Array") {
            params.default = $('#in_param_default_area').val();
        } else if (format == "Number") {
            params.default = $('#in_param_default_number').val();
        }

        params.paramtype = $('#in_type_key').select2('data')[0].title


        body.params = params
        let key = $('#in_type_key').select2('data')[0].text

        if (params.name === '') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }

        console.log(body)
        console.log(key)
        if((params.format == "Object" && key == "URL")||(params.format == "Array" && key == "URL")||(params.format == "Array" && key == "Query")){
            Swal.fire(
                'Oops...',
                "You can't select that param format and type key combination",
                'error')
        }else{
            save_data_api(root_path + 'app/api/webservice/params/' + _app_id_, body, UPDATE, function (data) {
                draw_datatable_rs(DT);
                UPDATE = '';
                $('#modal_new_param').modal('hide');
                $('#btn_build_function').click()
                HoldOn.close();
                console.log("webservice guardado")
                notify_success(data.message);
            })
        }



    })

    $("#save_params").click(async function () {
        let body = {};
        let type = {};
        let format = $('#in_format_edit').select2('data')[0].id

        body.name = $('#in_param_name_edit').val();
        body.description = $('#in_param_description_edit').val();
        body.format = $('#in_format_edit').select2('data')[0].id
        if (format == "String") {
            body.default = $('#in_param_default_edit').val();
        } else if (format == "Object"|| format == "Array") {
            body.default = $('#in_param_default_edit_area').val();
        } else if (format == "Number") {
            body.default = $('#in_param_default_edit_number').val();
        }


        body.paramtype = $('#in_type_key_edit').select2('data')[0].title

        console.log(body)

        if (body.name === '') {
            notify_warning(i18n.fill_all_fields)
            return false;
        }
        let key = $('#in_type_key_edit').select2('data')[0].text

        if((body.format == "Object" && key == "URL")||(body.format == "Array" && key == "URL")||(body.format == "Array" && key == "Query")){
            Swal.fire(
                'Oops...',
                "You can't select that param format and type key combination",
                'error')
        } else {
            save_data_api(root_path + 'app/api/webservice_params/' + _app_id_, body, UPDATE, function (data) {
                draw_datatable_rs(DT);
                UPDATE = '';
                $('#modal_edit_param').modal('hide');
                $('#btn_build_function').click()
                HoldOn.close();
                console.log("param guardado")
                notify_success(data.message);
            })
        }


    })


    $(document.body).on('click', '.delete_element', function () {
        let DELETE = $(this).val();
        confirm_delete(function () {
            $.ajax({
                url: root_path + 'app/api/webservice/' + _app_id_ + '/' + DELETE,
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


    $(document.body).on('click', '.update_element', async function () {
        UPDATE = $(this).val();
        try {

            let response = await fetch(root_path + 'app/api/webservice/' + _app_id_ + '/' + UPDATE, {})
            let data = await response.json()

            console.log(data.data)
            $('#modal_new_edit').modal('show');
            $('#in_name').val(data.data.name);
            $('#in_description').val(data.data.description);
            $('#in_url').val(data.data.url);
            $('#in_url2').val(data.data.urltwo);
            $('#in_url3').val(data.data.urlthree);

            $('#in_method').val(data.data.method)
            $('#in_method').trigger("change")


        } catch (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        }


    });
    getypes_edit()
    $(document.body).on('click', '.btn_edit_param', async function () {

        UPDATE = $(this).val();

        try {
            let response = await fetch(root_path + 'app/api/webservice_params/' + _app_id_ + "/" + UPDATE, {})
            let data = await response.json()

            console.log(data.data)
            $('#modal_edit_param').modal('show');

            $('#in_param_edit').val(UPDATE);
            $('#in_param_edit').attr('disabled', 'disabled');
            $('#in_param_name_edit').val(data.data.name);
            $('#in_param_description_edit').val(data.data.description);
            $('#in_param_default_edit').val(data.data.default);
            $('#in_param_default_edit_area').val(data.data.default);
            $('#in_param_default_edit_number').val(data.data.default);

            $('#in_type_key_edit').val(data.data.paramtype.key);
            $('#in_type_key_edit').trigger("change")

            $('#in_format_edit').val(data.data.format)
            $('#in_format_edit').trigger("change")


        } catch (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        }

    });


    $(document.body).on('click', '.btn_delete_param', function () {
        let DELETE = $(this).val();
        let paramdelete
        confirm_delete(async function () {
            try {
                let response = await fetch(root_path + 'app/api/webservice/' + _app_id_, {})
                let data = await response.json()
                for (let i = 0; i < data.data.length; i++) {
                    for (let j = 0; j < data.data[i].params.length; j++) {
                        if (data.data[i].params[j]._id == DELETE)
                            console.log(data.data[i]._id)
                        paramdelete = data.data[i]._id
                    }

                }
            } catch (err) {
                HoldOn.close();
                notify_error(err.responseJSON.message);
                console.error(err);
            }

            $.ajax({
                url: root_path + 'app/api/webservice_params/' + _app_id_ + '/' + DELETE + '/' + paramdelete,
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

    $(document.body).on("change", "#in_format_edit", function () {
        console.log("change")
        let format = $(this).select2('data')[0]
        console.log(format)
        if (format.text == "Object "|| format.text == "Array ") {
            $("#in_param_default_edit_area").show()
            $("#in_param_default_edit").hide()
            $("#in_param_default_edit_number").hide()
        }
        if (format.text == "String ") {
            $("#in_param_default_edit_area").hide()
            $("#in_param_default_edit").show()
            $("#in_param_default_edit_number").hide()
        }
        if (format.text == "Number") {
            $("#in_param_default_edit_area").hide()
            $("#in_param_default_edit").hide()
            $("#in_param_default_edit_number").show()

        }
    })
    $(document.body).on("change", "#in_format", function () {
        console.log("change")
        let format = $(this).select2('data')[0]
        console.log(format)
        if (format.text == "Object " || format.text == "Array ") {
            $("#in_param_default_area").show()
            $("#in_param_default").hide()
            $("#in_param_default_number").hide()
        }
        if (format.text == "String ") {
            $("#in_param_default_area").hide()
            $("#in_param_default").show()
            $("#in_param_default_number").hide()
        }
        if (format.text == "Number") {
            $("#in_param_default_area").hide()
            $("#in_param_default").hide()
            $("#in_param_default_number").show()

        }
    })

    ////////////Execute//////////////


    var Execute = ''
    $(document.body).on('click', '.play_element', async function () {
        $('#tab_execute').removeClass('disabled').click();
        Execute = $(this).val()
        await searchExecute(Execute)
        await paramToSelect()
    });

    $('#tab_catalog').click(function () {
        $('#tab_execute').addClass('disabled')
        $("#in_url_exe").html("")
    })


    async function searchExecute(id) {
        serch_id = id

        try {
            let response = await fetch(root_path + 'app/api/webservice/' + _app_id_ + '/' + serch_id, {})
            let data = await response.json()


            switch (data.data.method) {
                case "GET":
                    $('#card_exe').css("background-color", "#29b6f6")
                    $('#in_method_exe').val(data.data.method)
                    break;
                case "PUT":
                    $('#card_exe').css("background-color", " #fdd835")
                    $('#in_method_exe').val(data.data.method)
                    break;
                case "POST":
                    $('#card_exe').css("background-color", "#a5d6a7")

                    $('#in_method_exe').val(data.data.method)
                    break;
                case "DELETE":
                    $('#card_exe').css("background-color", "#f44336")
                    $('#in_method_exe').val(data.data.method)
                    break;
                default:
                    console.log("no existe")
                    break
            }
            $("#btn_execute").attr("pseudo",id)
            $("#description_webservice").text(data.data.description)
            $("#name_webservice").text(data.data.name)

            let optionone = document.createElement("option")
            optionone.value = data.data.url
            optionone.text = data.data.url
            $("#in_url_exe").append(optionone)

            let optiontwo = document.createElement("option")
            optiontwo.value = data.data.urltwo
            optiontwo.text = data.data.urltwo
            $("#in_url_exe").append(optiontwo)

            let optionthree = document.createElement("option")
            optionthree.value = data.data.urlthree
            optionthree.text = data.data.urlthree
            $("#in_url_exe").append(optionthree)


        } catch (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        }
    }

    var typeFormat
    var defaultoption
    var DTE = $("#datatable_exe").DataTable({
        "responsive": true,
        "data": {},
        "columns": [
            {
                "data": "_id",
            },
            {
                "data": "paramtype",
                render: function (data, v, row) {
                    return '<p>' + data.name + '</p>'
                }
            },
            {
                "data": "name",
                render: function (data, v, row) {
                    return '<p id="name_' + row._id + '" value="' + data + '">' + data + '</p>'
                }
            },
            {
                "data": "description"
            },
            {
                "data": "format",
                render: function (data, v, row) {
                    typeFormat = data
                    return '<p id="type_' + row._id + '" name="' + data + '">' + data + '</p>'
                }
            },
            {
                "data": "default",
                render: function (data, v, row) {
                    switch (typeFormat) {
                        case "Object":
                            defaultoption = '<textarea ip="default_exe_' + data + '" type="text" class="form-control"  id="default_' + row._id + '">' + data + '</textarea>'
                            break;
                        case "Array":
                            defaultoption = '<textarea ip="default_exe_' + data + '" type="text" class="form-control"  id="default_' + row._id + '">' + data + '</textarea>'
                            break;
                        case "String":
                            defaultoption = '<input ip="default_exe_' + data + '" value="' + data + '" type="text" class="form-control updatable" pseudo="' + row._id + '" id="default_' + row._id + '">'
                            break;
                        case "Number":
                            defaultoption = '<input ip="default_exe_' + data + '" value="' + data + '" type="number" class="form-control" id="default_' + row._id + '">'
                            break;
                        default:
                            defaultoption = ""
                            break;
                    }
                    return defaultoption

                }
            },
            {
                "data": "active",
                render: function (data, v, row) {
                    return ' <input type="checkbox" style="margin-left:25px" class="form-check-input in_active" typefor="' + row.paramtype.name + '" pseudo="' + row._id + '" id="in_active_' + row._id + '">'
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


        ],
        processing: false,
        serverSide: false,
        searching: false,

    });

    var paramstoselect = {}

    async function paramToSelect() {
        try {
            let response = await fetch(root_path + 'app/api/webservice/' + _app_id_ + '/' + serch_id, {})
            let data = await response.json()
            paramstoselect = data.data.params
            draw_datatable_local(paramstoselect, DTE)
        } catch (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        }
    }
    let body = {}
    let headers = {}
    $(document).on("change", "#in_url_exe", function () {
        let params = document.getElementsByClassName("in_active")

        for (let item of params) {

            if ($("#" + item.id).prop('checked')) {
                $("#" + item.id).click()
            }
        }
        body = {}
        headers = {}
    })
    $('#tab_catalog').click(function () {
        body = {}
        headers = {}
    })

    $(document).on("change", ".in_active", function () {
        let me = $(this)
        let url = $("#in_url_exe option:selected").text()
        let id = $(this).attr("pseudo")
        let text = $("#default_" + id).val()
        let option = $("#in_url_exe option:selected")
        let type = $("#type_" + id).attr("name")
        let name = $('#name_' + id).attr("value")
        let typefor = $(this).attr("typefor")
        console.log(typefor)


        if ((type == "String" || type == "Number" || type == "Object") && typefor != "Header" && typefor != "Body" && typefor != "URL") {
            let fullname
            if (type == "Object" && typefor == "Query") {
                text = encodeURI(text)
                fullname = text
            }
            fullname = name + "=" + text


            if ($(this).prop('checked')) {
                $("#default_" + id).attr("disabled", "disabled")
                if (url && !url.includes("?")) {
                    option.val(url + "?" + fullname)
                    option.text(url + "?" + fullname)
                } else {
                    option.val(url + "&" + fullname)
                    option.text(url + "&" + fullname)
                }
            } else {
                $("#default_" + id).removeAttr("disabled")
                if ((url.includes(fullname) && url.includes("?")) && !url.includes("&")) {

                    option.val(option.val().replace("?" + fullname, "").trim())
                    option.text(option.val().replace("?" + fullname, "").trim())

                } else if (url.includes(fullname) && url.includes("?") && url.includes("&" + fullname)) {

                    option.val(option.val().replace("&" + fullname, "").trim())
                    option.text(option.val().replace("&" + fullname, "").trim())

                } else if (url.includes(fullname) && url.includes("?" + fullname) && url.includes(fullname + "&")) {

                    option.val(option.val().replace(fullname + "&", "").trim())
                    option.text(option.val().replace(fullname + "&", "").trim())

                } else if (url.includes(fullname) && url.includes("?") && url.includes("&")) {

                    option.val(option.val().replace("?" + fullname, "").trim())
                    option.text(option.val().replace("?" + fullname, "").trim())

                }
            }
        } else if ((type == "String" || type == "Number" || type == "Object") && typefor == "URL") {
            let fullname
            if (type == "Object") {
                text = encodeURI(text)
            }

            if ($(this).prop('checked')) {

                if (url && url.includes(":" + name)) {
                    $("#default_" + id).attr("disabled", "disabled")
                    console.log("lo incluye")
                    option.val(option.val().replace(":" + name, text).trim())
                    option.text(option.val().replace(":" + name, text).trim())
                } else {
                    console.log("no incluido")
                    setTimeout(function () {
                        me.click()
                        console.log(me)
                        Swal.fire(
                            'Oops...',
                            "The field doesn't exist or is already used",
                            'error')
                    }, 300)
                }
            } else {
                $("#default_" + id).removeAttr("disabled")
                if (url && url.includes(text)) {
                    console.log("lo incluye")
                    option.val(option.val().replace(text, ":" + name).trim())
                    option.text(option.val().replace(text, ":" + name).trim())
                }
            }
        } else if (type == "Object" && typefor == "Body") {
            if ($(this).prop('checked')) {
                $("#default_" + id).attr("disabled", "disabled")
                text = JSON.parse(text)

                for (var [key, value] of Object.entries(text)) {
                    body[key] = value
                }
                console.log(body)
            } else {
                $("#default_" + id).removeAttr("disabled")
                text = JSON.parse(text)
                let helper = {}
                for (var [key, value] of Object.entries(text)) {
                    delete body[key]
                }
                console.log(body)
            }

        } else if ((type == "String" || type == "Number") && typefor == "Body") {
            if ($(this).prop('checked')) {
                $("#default_" + id).attr("disabled", "disabled")
                body[name] = text
            } else {
                $("#default_" + id).removeAttr("disabled")
                delete body[name]
            }
            console.log(body)
        } else if ((type == "String" || type == "Number") && typefor == "Header") {
            if ($(this).prop('checked')) {
                $("#default_" + id).attr("disabled", "disabled")
                headers[name] = text
            } else {
                $("#default_" + id).removeAttr("disabled")
                delete headers[name]
            }
            console.log(headers)
        } else if (type == "Object" && typefor == "Header") {
            if ($(this).prop('checked')) {
                $("#default_" + id).attr("disabled", "disabled")
                text = JSON.parse(text)

                for (var [key, value] of Object.entries(text)) {
                    headers[key] = value
                }
                console.log(headers)
            } else {
                $("#default_" + id).removeAttr("disabled")
                text = JSON.parse(text)

                for (var [key, value] of Object.entries(text)) {
                    delete headers[key]
                }
                console.log(headers)
            }
        }else if(type=="Array" && (typefor=="Body" || typefor=="Header")){
            text = JSON.parse(text)
            if ($(this).prop('checked')) {
                $("#default_" + id).attr("disabled", "disabled")

                console.log(text);
                if(typefor=="Header"){
                    headers[name] = text
                    console.log(headers)
                }else{
                    body[name] = text
                    console.log(body)
                }
            }else{
                $("#default_" + id).removeAttr("disabled")
                if(typefor=="Header"){
                    delete headers[name]
                    console.log(headers)
                }else{
                    delete body[name]
                    console.log(body)
                }
            }
        }

    })


    function getSelectedRange(editor_) {
        return {from: editor_.getCursor(true), to: editor_.getCursor(false)};
    }

    var editor = CodeMirror.fromTextArea(document.getElementById("in_content"), {
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true,
        mode: "javascript",
        gutters: ["CodeMirror-lint-markers"],
        lint: true,
        json:true,
        smartIndent: true
    });
    editor.setOption("theme", 'dracula');


    $('#formatCode').click(function () {
        console.log("fix")
        var range = getSelectedRange(editor);
        console.log(range)
        editor.autoIndentRange(range.from, range.to);
        editor.autoFormatRange(range.from, range.to);
    });

    $("#btn_execute").click(async function () {

        let url = $("#in_url_exe option:selected").text()
        let method = $("#in_method_exe").val()
        let typeRequest = $("#in_request_type").val()

        console.log(typeRequest)
        let fullbody = {
            bodyrequest: Object.keys(body).length >0?body:"",
            headerrequest: Object.keys(headers).length >0?headers:"",
            urlrequest: url,
            methodrequest: method,
            typeRequest: typeRequest
        }
        console.log(fullbody)
        $.post(root_path + 'app/api/webservice/recive/' + _app_id_,fullbody, function (data) {
            HoldOn.close();
            notify_success(data.message);
            console.log(data)

            $('#formatCode').show()

            data = JSON.stringify(data)
            data= data.replace(/,/g,",\n")
            let corch = "\\["
            let corchExit = "\\]"
            let key = "\\{"
            let keyExit = "\\}"
            if(data.includes("[")){
                data= data.replace(new RegExp(corch,"g"),"[\n")
            }
            if(data.includes("]")){
                data= data.replace(new RegExp(corchExit,"g"),"]\n")
            }
            if(data.includes("{")){
                data= data.replace(new RegExp(key,"g"),"{\n")
            }
            if(data.includes("}")){
                data= data.replace(new RegExp(keyExit,"g"),"\n}\n")
            }

            editor.setValue(data)
            var totalLines = editor.lineCount();
            editor.setSelection({line:0, ch:0}, {line:totalLines})
            $('#formatCode').click()





        }).fail(function (err) {
            HoldOn.close();
            notify_error(err.responseJSON.message);
            console.error(err);
        })


    })


})