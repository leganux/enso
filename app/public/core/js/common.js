var draw_datatable_rs = function (datatable) {
    datatable.clear().draw();
}

var draw_datatable = function (url, datatable) {
    if (!url || !datatable) {
        return 0;
    }
    datatable.clear().draw();
    HoldOn.open();
    $.ajax({
        url: url,
    }).done(function (data) {
        HoldOn.close();
        notify_success(data.message);

        datatable.clear().rows.add(data.data).draw();
    }).fail(function (err) {
        HoldOn.close();
        notify_error(err.responseJSON.message);
        console.error(err);
    });
}


var save_data_api = function (url, body, update, f_) {
    if (!url || !body) {
        return 0;
    }
    var method = 'POST';
    if (update && update !== '') {
        method = 'PUT'
        url = url + '/' + update;
    }
    HoldOn.open();
    $.ajax({
        url: url,
        method: method,
        data: body
    }).done(function (data) {
        HoldOn.close();
        notify_success(data.message);
        if (typeof f_ === 'function') {
            f_(data);
        }
    }).fail(function (err) {
        HoldOn.close();
        notify_error(err.responseJSON.message);
        console.error(err);
    });
}

var notify_error = function (message) {
    Toast.fire({
        icon: 'error',
        title: message
    })
}
var notify_warning = function (message) {
    Toast.fire({
        icon: 'warning',
        title: message
    })
}
var notify_success = function (message) {
    Toast.fire({
        icon: 'success',
        title: message
    })
}
var notify_info = function (message) {
    Toast.fire({
        icon: 'info',
        title: message
    })
}
var notify_question = function (message) {
    Toast.fire({
        icon: 'question',
        title: message
    })
}

var confirm_delete = function (f_) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e83e8c',
        cancelButtonColor: '#212121',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.value) {
            if (f_ && typeof f_ === 'function') {
                f_();
            }
        }
    })
}


var charge_select = function (elem, filter, url, valuename, textname) {
    HoldOn.open();
    if (!filter) {
        filter = {}
    }
    $(elem).html('<option value="-1"> ' + i18n.choose_one + ' </option>')
    $.getJSON(url, filter, function (data) {
        HoldOn.close();
        notify_success(data.message);
        if (typeof f_ === 'function') {
            f_();
        }
        data.data.map(function (item, i) {
            $(elem).append('<option value="' + item[valuename] + '"> ' + item[textname] + ' </option>')
        });
    }).fail(function () {
        HoldOn.close();
        notify_error(err.responseJSON.message);
        console.error(err);
    });
}

var snakeThis = function (elem) {
    $(elem).change(function () {
        let value = $(elem).val();
        value = v.snakeCase(value);
        $(elem).val(value.toLowerCase());
    });
}


function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function setCookie(cname, cvalue, exdays) {
    if (!exdays) {
        exdays = 15;
    }
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


var language = 'en_US';

if (getCookie('_LANGUAGE_')) {
    language = getCookie('_LANGUAGE_');
} else {
    language = 'en_US';
    setCookie('_LANGUAGE_', language);
}


function stripHtml(html) {
    // Create a new div element
    var temporalDivElement = document.createElement("div");
    // Set the HTML content with the providen
    temporalDivElement.innerHTML = html;
    // Retrieve the text property of the element (cross-browser support)
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
}


var make_token = function (length) {
    if (!length) {
        length = 11;
    }
    var a = '';
    var b = '';
    var c = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        a += characters.charAt(Math.floor(Math.random() * charactersLength));
        b += characters.charAt(Math.floor(Math.random() * charactersLength));
        c += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return a + '_X2Vuc28uYXBwLmxlZ2FudXguY29tXw_' + b + '_' + v.camelCase(window.btoa(moment().format())) + '_' + c;
}
var make_id = function (length) {
    if (!length) {
        length = 11;
    }
    var a = '';

    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        a += characters.charAt(Math.floor(Math.random() * charactersLength));

    }
    return a;
}


var upload_function = function (element) {

    $('#' + element).change(function () {
        if ($('#' + element).val() == '') {
            return 0;
        }
        HoldOn.open();
        var data = new FormData();
        data.append('file', $('#' + element)[0].files[0]);
        $.ajax({
            url: root_path + 'api/core/files/upload',
            data: data,
            contentType: false,
            processData: false,
            method: 'POST',
            success: function (data) {
                HoldOn.close();
                if (data.success) {
                    $('#' + element + '_save').val(data.file)
                }
            },
            error: function (err) {
                HoldOn.close();
                notify_error(err.responseJSON.message);
                console.error(err);
            }
        });

    })

}


var copy_clipboard = function (elementID) {
    var copyText = document.getElementById(elementID);
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    notify_success(i18n.successfully_copied)
}