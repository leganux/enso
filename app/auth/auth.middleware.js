const admin_allowed_routes = require('./../helpers/allowed_routes.helper').admin_allowed_routes;
const response_code = require('./../helpers/response_codes.helper').codes;

function stripTrailingSlash(str) {
    if (str.substr(-1) === '/') {
        return str.substr(0, str.length - 1);
    }
    return str;
}

let auth = async function (req, res, next) {

    var routes = {}
    var method = req.method.trim().toUpperCase();
    var url = req.originalUrl.trim().toLowerCase();

    if (url.includes('?')) {
        url = url.split('?')[0]
    }

    if (!req || !req.user || !req.user.role || !req.user.user) {
        res.status(403).json(response_code.code_403);
        return undefined;
    }
    if (req.user.kind === 'admin') {
        routes = await admin_allowed_routes(req);
        if (!routes || !routes.rules || routes.rules.length < 1) {
            res.status(403).json(response_code.code_403);
            return undefined;
        }
    }

    url = stripTrailingSlash(url);


    for (let i = 0; i < routes.rules.length; i++) {
        let item = routes.rules[i];

        let item_method = item.method.trim().toUpperCase();
        let item_url = item.original_url.trim().toLowerCase();
        item_url = stripTrailingSlash(item_url);


        if (item_url.includes('{_') && item_url.includes('_}')) {
            let id_search = item_url.split('{_')[1];
            id_search = id_search.split('_}')[0];
            let content = req.cookies[id_search]
            item_url = item_url.replace('{_' + id_search + '_}', content);
        }

        if (item_url.includes(':id')) {
            let arr = item_url.split('/');
            let arr_url = url.split('/');
            let pos = arr.indexOf(':id');
            let id = arr_url[pos];
            item_url = item_url.replace(':id', id)
        }
        if (item_url.includes(':name')) {
            let arr = item_url.split('/');
            let arr_url = url.split('/');
            let pos = arr.indexOf(':name');
            let id = arr_url[pos];
            item_url = item_url.replace(':name', id)
        }
        if (item_url.includes(':app_id')) {
            let arr = item_url.split('/');
            let arr_url = url.split('/');
            let pos = arr.indexOf(':app_id');
            let id = arr_url[pos];
            item_url = item_url.replace(':app_id', id)
        }


        if (item_url === url && method === item_method) {
            req.who = item.who;
            req.access = routes.access;
            next();
            return 1;
        }


    }
    res.status(403).json(response_code.code_403);
    return 0;

}

module.exports = {auth}