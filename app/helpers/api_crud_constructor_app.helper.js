const bcrypt = require('bcryptjs');
var env = require('./../config/environment.config').environment;
const saltRounds = env.bcryp_salt_rounds;
const moment = require('moment');
const response_codes = require('./response_codes.helper').codes

// req.who == req user logged must be equal to

let api_functions = {};

let no_middleware = async function (req, res, next) {
    next();
    return 0;
}

var get_app_id = function (req) {
    if (!req.params || !req.params.app_id) {
        return false;
    } else {
        return req.params.app_id;
    }
}

api_functions.create = function (router, model, middleware) {
    router.post('/:app_id/', middleware ? middleware : no_middleware, async (req, res) => {
        const body = req.body;
        //verify app
        if (!get_app_id(req)) {
            res.status(533).json(response_codes.code_533)
            return 0;
        }

        if (body.password) {
            body.password = await bcrypt.hash(body.password, saltRounds);
        }

        if (req.user && req.user.user) {
            body.owner = req.user.user;
        }

        body.app = get_app_id(req);

        try {
            var response = await new model(body).save();
            if (!response) {
                res.status(433).json(response_codes.code_433);
                return 0;
            }
            let ret = response_codes.code_200;
            ret.data = response;
            res.status(200).json(ret);
            return 0;
        } catch (e) {
            console.error('*** Error en CREATE' + model.collection.collectionName, e);
            res.status(500).json(response_codes.code_500);
            return 0;
        }
    });
};

api_functions.update = function (router, model, middleware) {
    router.put('/:app_id/:id', middleware ? middleware : no_middleware, async function (req, res) {
        let body = req.body;
        let id = req.params.id;

        body.updatedAt = moment().format();
        //verify app
        if (!get_app_id(req)) {
            res.status(533).json(response_codes.code_533)
            return 0;
        }

        try {
            if (body.password) {
                body.password = await bcrypt.hash(body.password, saltRounds);
            }
            var response = await model.findById(id)

            //only for owner
            if (req.who && response.owner && req.who !== '*' && response.owner != req.who) {
                res.status(403).json(response_codes.code_403);
                return 0;
            }


            response = await model.findByIdAndUpdate(id, {$set: body});

            if (!response) {
                res.status(434).json(response_codes.code_434);
                return 0;
            }

            let ret = response_codes.code_200;
            ret.data = response;
            res.status(200).json(ret);
            return 0;

        } catch (e) {
            console.error('*** Error en UPDATE ' + model.collection.collectionName, e);
            res.status(500).json(response_codes.code_500);
            return 0;
        }
    });
};

api_functions.updateWhere = function (router, model, middleware) {
    router.put('/:app_id/', middleware ? middleware : no_middleware, async function (req, res) {
        let body = req.body.body;
        let where = req.body.where;
        let or = req.body.or;
        let and = req.body.and;
        let select = req.body.select;
        let paginate = req.body.paginate;
        let sort = req.body.sort;
        var find = {};


        //verify app
        if (!get_app_id(req)) {
            res.status(533).json(response_codes.code_533)
            return 0;
        }

        body.updatedAt = moment().format();

        if (!where && !or && !and) {
            res.status(435).json(response_codes.code_435);
            return 0;
        }

        if (where) {
            for (const [key, val] of Object.entries(where)) {
                find[key] = val;
            }
        } else if (or) {
            if (!or.to_find || !or.fields) {
                res.status(435).json(response_codes.code_435);
                return 0;
            }
            let inner_or = [];
            or.fields.map(function (jtem, j) {
                or.to_find.map(function (item, i) {
                    let ob = {}
                    ob[jtem] = item
                    inner_or.push(ob);
                });
            });

            find = {$or: inner_or};

        } else if (and) {

            let inner_and = [];
            and.fields.map(function (jtem, j) {
                inner_and.push(jtem);
            });

            find = {$and: inner_and};

        }

        let query = model.findOne(find);

        if (select) {
            if (typeof select == 'string') {
                select = select.split(',')
            }

            let select_obj = select.map(function (item, i) {
                let ob = {}
                ob[item] = 1
                return ob
            });

            query.select(select_obj)

        }
        if (paginate && paginate.limit && paginate.page) {
            paginate.limit = Number(paginate.limit);
            paginate.page = Number(paginate.page);
            query.limit(paginate.limit).skip(paginate.page * paginate.limit);
        }
        if (sort) {
            let order = {};
            for (const [key, val] of Object.entries(sort)) {
                order[key] = val;
            }
            query.sort(order);
        }


        try {
            if (body.password) {
                body.password = await bcrypt.hash(body.password, saltRounds);
            }


            var actObj = await query.exec();

            if (!actObj) {
                res.status(404).json(response_codes.code_404);
                return 0;
            }

            //only for owner
            if (req.who && actObj.owner && req.who !== '*' && actObj.owner != req.who) {
                res.status(403).json(response_codes.code_403);
                return 0;
            }

            for (const [key, val] of Object.entries(body)) {
                actObj[key] = val;
            }

            actObj.app = get_app_id(req)

            if (actObj.owner != req.user.user && req.user.kind == 'admin' && req.who !== '*') {
                if (!response) {
                    res.status(403).json(response_codes.code_403);
                    return 0;
                }
            }

            var response = await actObj.save();

            if (!response) {
                res.status(434).json(response_codes.code_434);
                return 0;
            }

            let ret = response_codes.code_200;
            ret.data = response;
            res.status(200).json(ret);
            return 0;

        } catch (e) {
            console.error('*** Error en UPDATE ' + model.collection.collectionName, e);
            res.status(500).json(response_codes.code_500);
            return 0;
        }
    });
}

api_functions.readOne = function (router, model, middleware, populate) {

    router.get('/:app_id/one', middleware ? middleware : no_middleware, async function (req, res) {
        let body = req.query.data;
        let where = req.query.where;
        let or = req.query.or;
        let and = req.query.and;
        let select = req.query.select;
        let paginate = req.query.paginate;
        let sort = req.query.sort;
        var find = {};

        //verify app
        if (!get_app_id(req)) {
            res.status(533).json(response_codes.code_533)
            return 0;
        }

        //only for owner
        if (req.who && req.who !== '*') {
            find['$and'].push({'owner': req.who})
        }

        find['$and'].push({'app': get_app_id(req)})


        if (where) {
            for (const [key, val] of Object.entries(where)) {
                find[key] = val;
            }
        } else if (or) {
            if (!or.to_find || !or.fields) {
                res.status(435).json(response_codes.code_435);
                return 0;
            }
            let inner_or = [];
            or.fields.map(function (jtem, j) {
                or.to_find.map(function (item, i) {
                    let ob = {}
                    ob[jtem] = item
                    inner_or.push(ob);
                });
            });

            find = {$or: inner_or};

        } else if (and) {

            let inner_and = [];
            and.fields.map(function (jtem, j) {
                inner_and.push(jtem);
            });

            find = {$and: inner_and};

        }


        let query = model.findOne(find);


        if (select) {
            if (typeof select == 'string') {
                select = select.split(',')
            }

            let select_obj = select.map(function (item, i) {
                let ob = {}
                ob[item] = 1
                return ob
            });

            query.select(select_obj)

        }
        if (paginate && paginate.limit && paginate.page) {
            paginate.limit = Number(paginate.limit);
            paginate.page = Number(paginate.page);
            query.limit(paginate.limit).skip(paginate.page * paginate.limit);
        }
        if (sort) {
            let order = {};
            for (const [key, val] of Object.entries(sort)) {
                order[key] = val;
            }
            query.sort(order);
        }

        if (populate) {
            if (populate && populate.length > 0) {
                populate.map(function (item, i, arr) {
                    query.populate(item)
                });
            }
        }

        try {

            var response = await query.exec();

            if (!response) {
                res.status(404).json(response_codes.code_404);
                return 0;
            }


            let ret = response_codes.code_200;
            ret.data = response;
            res.status(200).json(ret);
            return 0;

        } catch (e) {
            console.error('*** Error en READOne ' + model.collection.collectionName, e);
            res.status(500).json(response_codes.code_500);
            return 0;
        }
    });

};

api_functions.read = function (router, model, middleware, populate) {

    router.get('/:app_id/', middleware ? middleware : no_middleware, async function (req, res) {


        let body = req.query.data;
        let where = req.query.where;
        let or = req.query.or;
        let and = req.query.and;
        let select = req.query.select;
        let paginate = req.query.paginate;
        let sort = req.query.sort;
        var find = {};


        //verify app
        if (!get_app_id(req)) {
            res.status(533).json(response_codes.code_533)
            return 0;
        }

        if (!find['$and']) {
            find['$and'] = [];
        }
        //only for owner
        if (req.who && req.who !== '*') {
            find['$and'].push({'owner': req.who})
        }

        find['$and'].push({'app': get_app_id(req)})


        if (where) {
            for (const [key, val] of Object.entries(where)) {
                find[key] = val;
            }
        } else if (or) {
            if (!or.to_find || !or.fields) {
                res.status(435).json(response_codes.code_435);
                return 0;
            }
            let inner_or = [];
            or.fields.map(function (jtem, j) {
                or.to_find.map(function (item, i) {
                    let ob = {}
                    ob[jtem] = item
                    inner_or.push(ob);
                });
            });

            find = {$or: inner_or};

        } else if (and) {

            let inner_and = [];
            and.fields.map(function (jtem, j) {
                inner_and.push(jtem);
            });

            find = {$and: inner_and};

        }


        let query = model.find(find);

        if (select) {
            if (typeof select == 'string') {
                select = select.split(',')
            }

            let select_obj = select.map(function (item, i) {
                let ob = {}
                ob[item] = 1
                return ob
            });

            query.select(select_obj)

        }
        if (paginate && paginate.limit && paginate.page) {
            paginate.limit = Number(paginate.limit);
            paginate.page = Number(paginate.page);
            query.limit(paginate.limit).skip(paginate.page * paginate.limit);
        }
        if (sort) {
            let order = {};
            for (const [key, val] of Object.entries(sort)) {
                order[key] = val;
            }
            query.sort(order);
        }

        if (populate) {
            if (populate && populate.length > 0) {
                populate.map(function (item, i, arr) {
                    query.populate(item)
                });
            }
        }

        try {

            var response = await query.exec();

            if (!response) {
                res.status(404).json(response_codes.code_404);
                return 0;
            }

            let ret = response_codes.code_200;
            ret.data = response;
            res.status(200).json(ret);
            return 0;

        } catch (e) {
            console.error('*** Error en READ ' + model.collection.collectionName, e);
            res.status(500).json(response_codes.code_500);
            return 0;
        }
    });

};

api_functions.readById = function (router, model, middleware, populate) {

    router.get('/:app_id/:id', middleware ? middleware : no_middleware, async function (req, res) {
        let id = req.params.id;
        let select = req.query.select;
        let paginate = req.query.paginate;
        let sort = req.query.sort;
        //verify app
        if (!get_app_id(req)) {
            console.log('Entrqui')

            res.status(533).json(response_codes.code_533)
            return 0;
        }


        let query = model.findById(id)

        if (select) {
            if (typeof select == 'string') {
                select = select.split(',')
            }

            let select_obj = select.map(function (item, i) {
                let ob = {}
                ob[item] = 1
                return ob
            });

            query.select(select_obj)

        }
        if (paginate && paginate.limit && paginate.page) {
            paginate.limit = Number(paginate.limit);
            paginate.page = Number(paginate.page);
            query.limit(paginate.limit).skip(paginate.page * paginate.limit);
        }
        if (sort) {
            let order = {};
            for (const [key, val] of Object.entries(sort)) {
                order[key] = val;
            }
            query.sort(order);
        }

        if (populate) {

            if (populate && populate.length > 0) {
                populate.map(function (item, i, arr) {
                    query.populate(item)
                });
            }
        }

        try {

            var response = await query.exec();

            //only for owner
            if (req.who && response.owner && req.who !== '*' && (response.owner !== req.who || response.owner._id !== req.who)) {
                res.status(403).json(response_codes.code_403);
                return 0;
            }


            if (!response) {
                res.status(404).json(response_codes.code_404);
                return 0;
            }

            let ret = response_codes.code_200;
            ret.data = response;
            res.status(200).json(ret);
            return 0;

        } catch (e) {
            console.error('*** Error en READ ' + model.collection.collectionName, e);
            res.status(500).json(response_codes.code_500);
            return 0;
        }
    });

};

api_functions.updateOrCreate = function (router, model, middleware) {

    router.post('/:app_id/updateOrCreate', middleware ? middleware : no_middleware, async function (req, res) {
        var find = {};
        let body = req.body.data;
        let where = req.body.where;


        //verify app
        if (!get_app_id(req)) {
            res.status(533).json(response_codes.code_533)
            return 0;
        }


        if (where) {
            for (const [key, val] of Object.entries(where)) {
                find[key] = val;
            }
        }

        if (!find['$and']) {
            find['$and'] = [];
        }
        //only for owner
        if (req.who && req.who !== '*') {
            find['$and'].push({'owner': req.who})
        }


        find['$and'].push({'app': get_app_id(req)})

        try {
            var query = await model.findOne(where);

            //only for owner
            if (query && req.who && query.owner && req.who !== '*' && query.owner !== req.who) {
                res.status(403).json(response_codes.code_403);
                return 0;
            }


            if (!query) {
                where.app = get_app_id(req)
                query = new model(where);
            }

            if (body) {
                for (const [key, val] of Object.entries(body)) {
                    query[key] = val;
                }
            }

            query.updatedAt = moment().format();
            query.owner = req.user.user;
            var response = await query.save();

            if (!response) {
                res.status(436).json(response_codes.code_436);
                return 0;
            }

            let ret = response_codes.code_200;
            ret.data = response;
            res.status(200).json(ret);
            return 0;

        } catch (e) {
            console.error('*** Error on updateOrCreate ' + model.collection.collectionName, e);
            res.status(500).json(response_codes.code_500);
            return 0;
        }


    });


};

api_functions.delete = function (router, model, middleware) {
    router.delete('/:app_id/:id', middleware ? middleware : no_middleware, async function (req, res) {
        var id = req.params.id;

        //verify app
        if (!get_app_id(req)) {
            res.status(533).json(response_codes.code_533)
            return 0;
        }


        try {
            var response = await model.findById(id);
            //only for owner
            if (req.who && response.owner && req.who !== '*' && response.owner !== req.who) {
                res.status(403).json(response_codes.code_403);
                return 0;
            }

            response = await model.findByIdAndRemove(id);

            if (!response) {
                res.status(404).json(response_codes.code_404);
                return 0;
            }

            let ret = response_codes.code_200;
            ret.data = response;
            res.status(200).json(ret);
            return 0;

        } catch (e) {
            console.error('*** Error en DELETE ' + model.collection.collectionName, e);
            res.status(500).json(response_codes.code_500);
            return 0;
        }

    });

};

api_functions.datatable = function (router, model, middleware, populate, search_fields) {
    if (!search_fields) {
        search_fields = []
    } else {
        if (typeof search_fields === 'string') {
            search_fields = search_fields.split(',')
        }
    }


    router.post('/:app_id/datatable', middleware ? middleware : no_middleware, async (req, res) => {
        var order = {};


        //verify app
        if (!get_app_id(req)) {
            res.status(533).json(response_codes.code_533)
            return 0;
        }


        if (req.body.columns && req.body.order) {
            req.body.order.map((item, i) => {
                var name = req.body.columns[item.column].data;
                var dir = item.dir;
                order[name] = dir;
            });
        }

        var find = {};

        //only for owner
        if (req.who && req.who !== '*') {
            find['owner'] = req.who.toString();
        }

        find['app'] = get_app_id(req);

        model.dataTables({
            limit: req.body.length,
            skip: req.body.start,
            search: {
                value: req.body.search.value,
                fields: search_fields
            },
            sort: order,
            populate: populate,
            find: find
        }).then(async function (table) {
            table.success = true;
            table.message = 'OK';
            table.recordsTotal = table.total
            table.recordsFiltered = table.total


            res.status(200).json(table); // table.total, table.data
        }).catch(function (e) {
            console.error('*** Error en DATATABLE ' + model.collection.collectionName, e);
            res.status(500).json(response_codes.code_500);
            return 0;
        })
    });
};

api_functions.all = function (router, model, middelware, populate, search_fields) {
    api_functions.create(router, model, middelware);
    api_functions.update(router, model, middelware);
    api_functions.updateWhere(router, model, middelware);
    api_functions.readOne(router, model, middelware, populate);
    api_functions.readById(router, model, middelware, populate);
    api_functions.read(router, model, middelware, populate);
    api_functions.delete(router, model, middelware);
    api_functions.updateOrCreate(router, model, middelware);
    api_functions.datatable(router, model, middelware, populate, search_fields);
};

module.exports = api_functions;