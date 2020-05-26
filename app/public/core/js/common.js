const draw_datatable_rs = function (datatable) {
    datatable.clear().draw();
}

const draw_datatable = function (url, datatable) {
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
        notify_error(err.message);
        console.error(err);
    });
}


const save_data_api = function (url, body, update, f_) {
    if (!url || !body) {
        return 0;
    }
    var method = 'POST';
    if (update && update !== '') {
        method = 'PUT'
        url = url + '/' + update;
    }
    $.ajax({
        url: url,
        method: method,
        data: body
    }).done(function (data) {
        HoldOn.close();
        notify_success(data.message);
        if (typeof f_ === 'function') {
            f_();
        }
    }).fail(function (err) {
        HoldOn.close();
        notify_error(err.message);
        console.error(err);
    });
}

const notify_error = function (message) {
    Toast.fire({
        icon: 'error',
        title: message
    })
}
const notify_warning = function (message) {
    Toast.fire({
        icon: 'warning',
        title: message
    })
}
const notify_success = function (message) {
    Toast.fire({
        icon: 'success',
        title: message
    })
}
const notify_info = function (message) {
    Toast.fire({
        icon: 'info',
        title: message
    })
}
const notify_question = function (message) {
    Toast.fire({
        icon: 'question',
        title: message
    })
}

const confirm_delete = function (f_) {
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


const charge_select = function (elem, filter, url, valuename, textname) {
    HoldOn.open();
    if (!filter) {
        filter = {}
    }
    $(elem).html('<option value="-1"> Choose... </option>')
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
        notify_error(err.message);
        console.error(err);
    });
}

const snakeThis = function (elem) {
    $(elem).change(function () {
        let value = $(elem).val();
        value = v.snakeCase(value);
        $(elem).val(value);
    });
}