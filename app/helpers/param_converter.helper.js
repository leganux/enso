/**
 * *
 * This helper is used in combination of params template to send  variables and data from
 * backend to frontend automatically using javascript.
 *
 * Use carefully and avoid share important information  about user or system
 *
 * */

const param_converter = function (obj) {
    var r_obj = [];
    for (var clave in obj) {
        if (obj.hasOwnProperty(clave)) {
            let value = obj[clave];
            let kind = 'object';
            if (typeof value !== 'function' && typeof value !== null && typeof value !== 'undefined') {
                if (typeof value === 'object' && value.constructor === Object) {
                    value = JSON.stringify(value)
                    kind = 'object';
                } else if (typeof value === 'object' && value.constructor === Array) {
                    value = JSON.stringify(value)
                    kind = 'object';
                } else if (typeof value === 'number') {
                    kind = 'number';
                } else if (typeof value === 'string') {
                    kind = 'string';
                } else if (typeof value === 'boolean') {
                    kind = 'boolean';
                }
                r_obj.push({
                    name: clave,
                    value: value,
                    kind: kind
                });
            }
        }
    }
    return r_obj;
}

module.exports = param_converter;