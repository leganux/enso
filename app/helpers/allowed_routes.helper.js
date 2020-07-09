var route = require('./../models/core/routes.m')
var route_user = require('./../models/routes_user.m')

var role = require('./../models/core/admin_role.m')
var role_user = require('./../models/user_roles.m')

var role_permission = require('./../models/core/permission_by_rol.m')
var role_permission_user = require('./../models/user_permission_by_rol.m')
var env = require('./../config/environment.config').environment
const root_path = env.root_path;
const admin_path = env.root_path + env.control_panel_url;

const lodash = require('lodash')

function getUniqueArray(arr = [], compareProps = []) {
    let modifiedArray = [];
    if (compareProps.length === 0 && arr.length > 0)
        compareProps.push(...Object.keys(arr[0]));
    arr.map(item => {
        if (modifiedArray.length === 0) {
            modifiedArray.push(item);
        } else {
            if (!modifiedArray.some(item2 =>
                compareProps.every(eachProps => item2[eachProps] === item[eachProps])
            )) {
                modifiedArray.push(item);
            }
        }
    });
    return modifiedArray;
}

function stripTrailingSlash(str) {
    if (str.substr(-1) === '/') {
        return str.substr(0, str.length - 1);
    }
    return str;
}

var admin_allowed_routes = async function (req) {
    if (!req || !req.user || !req.user.role || !req.user.user) {
        return undefined;
    }
    if (req.user.kind !== 'admin') {
        return undefined;
    }
    my_role = req.user.role
    my_admin = req.user.user


    try {
        let list_of_role_permissions = await role_permission
            .find({role: my_role})
            .populate({path: 'role', model: role})
            .populate({path: 'route', model: route})
            .exec();

        var list = [];
        var panel = [];

        if (list_of_role_permissions && list_of_role_permissions.length > 0) {
            for (let i = 0; i < list_of_role_permissions.length; i++) {
                let item = list_of_role_permissions[i];
                if (item.route && item.route.type) {

                    var item_url = stripTrailingSlash(item.route.url)

                    switch (item.route.type) {
                        case 'admin_panel' :
                            if (item.see) {
                                list.push({
                                    original_url: admin_path + item_url,
                                    method: 'GET',
                                    who: '*',
                                    isApi: false
                                })
                                panel.push(item_url)
                            }
                            break;

                        case 'api' :
                            if (item.create) {
                                list.push({
                                    original_url: root_path + item_url,
                                    method: 'POST',
                                    who: '*',
                                    isApi: true
                                })
                            }
                            if (item.read_me) {
                                list.push({
                                    original_url: root_path + item_url,
                                    method: 'GET',
                                    who: my_admin,
                                    isApi: true
                                })
                            }
                            if (item.read_all) {
                                list.push({
                                    original_url: root_path + item_url,
                                    method: 'GET',
                                    who: '*',
                                    isApi: true
                                })
                            }
                            if (item.update_me) {
                                list.push({
                                    original_url: root_path + item_url,
                                    method: 'PUT',
                                    who: my_admin,
                                    isApi: true
                                })
                            }
                            if (item.update_all) {
                                list.push({
                                    original_url: root_path + item_url,
                                    method: 'PUT',
                                    who: '*',
                                    isApi: true
                                })
                            }
                            if (item.delete_me) {
                                list.push({
                                    original_url: root_path + item_url,
                                    method: 'DELETE',
                                    who: my_admin,
                                    isApi: true
                                })
                            }
                            if (item.delete_all) {
                                list.push({
                                    original_url: root_path + item_url,
                                    method: 'DELETE',
                                    who: '*',
                                    isApi: true
                                })
                            }
                            break;

                    }
                }

            }
        }


        list = getUniqueArray(list, ['original_url', 'method', 'who']);
        let access = lodash.uniq(panel);
        var new_list = []
        list.map(function (item) {
            new_list.push(item)
            if (item.method == 'GET' && item.isApi) {
                new_list.push({
                    original_url: item.original_url + '/:id',
                    method: item.method,
                    who: item.who
                });
                new_list.push({
                    original_url: item.original_url + '/one',
                    method: item.method,
                    who: item.who
                });
                new_list.push({
                    original_url: item.original_url + '/datatable',
                    method: 'POST',
                    who: item.who
                });
            }
            if (item.method == 'POST' && item.isApi) {
                new_list.push({
                    original_url: item.original_url + '/updateOrCreate',
                    method: item.method,
                    who: item.who
                });

            }
            if (item.method == 'PUT' && item.isApi) {
                new_list.push({
                    original_url: item.original_url + '/:id',
                    method: item.method,
                    who: item.who
                });
            }
            if (item.method == 'DELETE' && item.isApi) {
                new_list.push({
                    original_url: item.original_url + '/:id',
                    method: item.method,
                    who: item.who
                });
            }
        })


        return {rules: new_list, access: access}
    } catch (e) {
        console.error(e)
        return undefined
    }
}
var user_allowed_routes = async function (req) {

    if (!req || !req.user || !req.user.role || !req.user.user) {
        return undefined;
    }
    if (req.user.kind !== 'user') {
        return undefined;
    }
    my_role = req.user.role
    my_admin = req.user.user


    try {
        let list_of_role_permissions = await role_permission_user
            .find({role: my_role})
            .populate({path: 'role', model: role_user})
            .populate({path: 'route', model: route_user})
            .exec();

        var list = [];
        var panel = [];

        if (list_of_role_permissions && list_of_role_permissions.length > 0) {
            for (let i = 0; i < list_of_role_permissions.length; i++) {
                let item = list_of_role_permissions[i];
                if (item.route && item.route.type) {

                    var item_url = stripTrailingSlash(item.route.url)

                    switch (item.route.type) {
                        case 'admin_panel' :
                            if (item.see) {
                                list.push({
                                    original_url: admin_path + item_url,
                                    method: 'GET',
                                    who: '*',
                                    isApi: false
                                })
                                panel.push(item_url)
                            }
                            break;

                        case 'api' :
                            if (item.create) {
                                list.push({
                                    original_url: root_path + item_url,
                                    method: 'POST',
                                    who: '*',
                                    isApi: true
                                })
                            }
                            if (item.read_me) {
                                list.push({
                                    original_url: root_path + item_url,
                                    method: 'GET',
                                    who: my_admin,
                                    isApi: true
                                })
                            }
                            if (item.read_all) {
                                list.push({
                                    original_url: root_path + item_url,
                                    method: 'GET',
                                    who: '*',
                                    isApi: true
                                })
                            }
                            if (item.update_me) {
                                list.push({
                                    original_url: root_path + item_url,
                                    method: 'PUT',
                                    who: my_admin,
                                    isApi: true
                                })
                            }
                            if (item.update_all) {
                                list.push({
                                    original_url: root_path + item_url,
                                    method: 'PUT',
                                    who: '*',
                                    isApi: true
                                })
                            }
                            if (item.delete_me) {
                                list.push({
                                    original_url: root_path + item_url,
                                    method: 'DELETE',
                                    who: my_admin,
                                    isApi: true
                                })
                            }
                            if (item.delete_all) {
                                list.push({
                                    original_url: root_path + item_url,
                                    method: 'DELETE',
                                    who: '*',
                                    isApi: true
                                })
                            }
                            break;

                    }
                }

            }
        }


        list = getUniqueArray(list, ['original_url', 'method', 'who']);
        let access = lodash.uniq(panel);
        var new_list = []
        list.map(function (item) {
            new_list.push(item)
            if (item.method == 'GET' && item.isApi) {
                new_list.push({
                    original_url: item.original_url + '/:id',
                    method: item.method,
                    who: item.who
                });
                new_list.push({
                    original_url: item.original_url + '/one',
                    method: item.method,
                    who: item.who
                });
                new_list.push({
                    original_url: item.original_url + '/datatable',
                    method: 'POST',
                    who: item.who
                });
            }
            if (item.method == 'POST' && item.isApi) {
                new_list.push({
                    original_url: item.original_url + '/updateOrCreate',
                    method: item.method,
                    who: item.who
                });

            }
            if (item.method == 'PUT' && item.isApi) {
                new_list.push({
                    original_url: item.original_url + '/:id',
                    method: item.method,
                    who: item.who
                });
            }
            if (item.method == 'DELETE' && item.isApi) {
                new_list.push({
                    original_url: item.original_url + '/:id',
                    method: item.method,
                    who: item.who
                });
            }
        })


        return {rules: new_list, access: access}
    } catch (e) {
        console.error(e)
        return undefined
    }
}

module.exports = {admin_allowed_routes, user_allowed_routes};