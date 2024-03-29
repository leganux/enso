var moment = require('moment');
var axios = require('axios');
var bcrypt = require('bcryptjs');
var fs_extra = require('fs-extra');
var fs = require('fs');
var lodash = require('lodash');
var voca = require('voca');
var {models, schemas, mongoose} = require('./db');
var functions = require('./functions/main');
var functions_cron = require('./functions/cron');
var response_codes = require('./helpers/response_codes.helper');

var response_function = function (error, success) {

    if (error) {
        process.send(
            {
                error: error,
                end: true,
            }
        );
        return 0;
    }
    process.send(
        {
            error: false,
            end: true,
            data: success
        }
    );
    return 0;

}


process.on('message', async (msg) => {

    try {
        if (msg.kind == 'DB') {
            switch (msg.method) {
                case 'POST':
                    var who = msg.who;
                    var new_element = new models[msg.db_name](msg.data);
                    var saved = await new_element.save();
                    if (saved) {
                        process.send(
                            {
                                error: false,
                                end: true,
                                data: saved
                            }
                        );
                        return 0;
                    } else {
                        process.send(
                            {
                                error: 'not_saved',
                                end: true,
                            }
                        );
                        return 0;
                    }
                    break;
                case 'PUT':
                    var who = msg.who;
                    var model = models[msg.db_name];
                    var body = msg.data;
                    var id = msg.id;

                    if (body.updatedAt) {
                        body.updatedAt = moment().format();
                    }


                    try {
                        if (body.password) {
                            body.password = await bcrypt.hash(body.password, saltRounds);
                        }

                        var response = await model.findById(id)
                        //only for owner
                        if (who && response.owner && who !== '*' && response.owner != who) {
                            process.send(
                                {
                                    error: response_codes.code_403,
                                    end: true,
                                }
                            );
                            return 0
                        }

                        response = await model.findByIdAndUpdate(id, {$set: body});

                        if (!response) {
                            process.send(
                                {
                                    error: 'not saved',
                                    end: true,
                                }
                            );
                            return 0
                        }

                        process.send(
                            {
                                error: false,
                                end: true,
                                data: response
                            }
                        );

                    } catch (e) {
                        console.error('*** Error en UPDATE ' + model.collection.collectionName, e);
                        res.status(500).json(response_codes.code_500);
                        return 0;
                    }


                    break;
                case 'GET_ALL':
                    var who = msg.who;
                    var {where, or, and, select, paginate, sort} = msg.data;
                    var find = {};
                    var model = models[msg.db_name];
                    if (where) {
                        for (const [key, val] of Object.entries(where)) {
                            find[key] = val;
                        }
                    } else if (or) {
                        if (!or.to_find || !or.fields) {
                            res.status(435).json(response_codes.code_435);
                            return 0;
                        }
                        var inner_or = [];
                        or.fields.map(function (jtem, j) {
                            or.to_find.map(function (item, i) {
                                var ob = {}
                                ob[jtem] = item
                                inner_or.push(ob);
                            });
                        });

                        find = {$or: inner_or};

                    } else if (and) {

                        var inner_and = [];
                        and.fields.map(function (jtem, j) {
                            inner_and.push(jtem);
                        });

                        find = {$and: inner_and};

                    }
                    //only for owner
                    if (who && who !== '*') {
                        find['$and'].push({'owner': who})
                    }
                    var query = model.find(find);
                    if (select) {
                        if (typeof select == 'string') {
                            select = select.split(',')
                        }

                        var select_obj = select.map(function (item, i) {
                            var ob = {}
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
                        var order = {};
                        for (const [key, val] of Object.entries(sort)) {
                            order[key] = val;
                        }
                        query.sort(order);
                    }
                    /*  if (populate) {
                          if (populate && populate.length > 0) {
                              populate.map(function (item, i, arr) {
                                  query.populate(item)
                              });
                          }
                      }*/
                    try {
                        var response = await query.exec();
                        if (!response) {
                            process.send(
                                {
                                    error: 'not_saved',
                                    end: true,
                                }
                            );
                            return 0;
                        }
                        process.send(
                            {
                                error: false,
                                end: true,
                                data: response
                            }
                        );

                    } catch (e) {
                        console.error('*** Error en READ ' + model.collection.collectionName, e);
                        process.send(
                            {
                                error: e,
                                end: true,
                            }
                        );
                        return 0;
                    }
                    break;
                case 'GET_ONE':
                    var who = msg.who;
                    var {where, or, and, select, paginate, sort} = msg.data;
                    var find = {};
                    var model = models[msg.db_name];

                    if (where) {
                        for (const [key, val] of Object.entries(where)) {
                            find[key] = val;
                        }
                    } else if (or) {
                        if (!or.to_find || !or.fields) {
                            res.status(435).json(response_codes.code_435);
                            return 0;
                        }
                        var inner_or = [];
                        or.fields.map(function (jtem, j) {
                            or.to_find.map(function (item, i) {
                                var ob = {}
                                ob[jtem] = item
                                inner_or.push(ob);
                            });
                        });

                        find = {$or: inner_or};

                    } else if (and) {

                        var inner_and = [];
                        and.fields.map(function (jtem, j) {
                            inner_and.push(jtem);
                        });

                        find = {$and: inner_and};

                    }
                    //only for owner
                    if (who && who !== '*') {
                        find['$and'].push({'owner': who})
                    }
                    var query = model.findOne(find);
                    if (select) {
                        if (typeof select == 'string') {
                            select = select.split(',')
                        }

                        var select_obj = select.map(function (item, i) {
                            var ob = {}
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
                        var order = {};
                        for (const [key, val] of Object.entries(sort)) {
                            order[key] = val;
                        }
                        query.sort(order);
                    }
                    /*   if (populate) {
                           if (populate && populate.length > 0) {
                               populate.map(function (item, i, arr) {
                                   query.populate(item)
                               });
                           }
                       }*/
                    try {
                        var response = await query.exec();
                        if (!response) {
                            process.send(
                                {
                                    error: 'not_saved',
                                    end: true,
                                }
                            );
                            return 0;
                        }
                        process.send(
                            {
                                error: false,
                                end: true,
                                data: response
                            }
                        );

                    } catch (e) {
                        console.error('*** Error en READ ' + model.collection.collectionName, e);
                        process.send(
                            {
                                error: e,
                                end: true,
                            }
                        );
                    }
                    break;
                case 'GET_ID':

                    var who = msg.who;
                    var id = msg.id;
                    var model = models[msg.db_name];

                    var {select, paginate, sort} = msg.data;

                    var query = model.findById(id);


                    if (select) {
                        if (typeof select == 'string') {
                            select = select.split(',')
                        }

                        var select_obj = select.map(function (item, i) {
                            var ob = {}
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
                        var order = {};
                        for (const [key, val] of Object.entries(sort)) {
                            order[key] = val;
                        }
                        query.sort(order);
                    }

                    /* if (populate) {

                         if (populate && populate.length > 0) {
                             populate.map(function (item, i, arr) {
                                 query.populate(item)
                             });
                         }
                     }*/

                    try {

                        var response = await query.exec();


                        if (!response) {
                            process.send(
                                {
                                    error: response_codes.code_404,
                                    end: true,
                                }
                            );
                            return 0;
                        }

                        //only for owner
                        if (who && response.owner && who !== '*' && (response.owner !== who || response.owner._id !== who)) {
                            process.send(
                                {
                                    error: response_codes.code_433,
                                    end: true,
                                }
                            );
                            return 0
                        }


                        process.send(
                            {
                                error: false,
                                end: true,
                                data: response
                            }
                        );

                    } catch (e) {
                        console.error(e);
                        process.send(
                            {
                                error: e,
                                end: true,
                            }
                        );
                    }
                    break;
                case 'PUT_where':
                    var who = msg.who;
                    var {where, body, and, or, select, paginate, sort} = msg.data;
                    var model = models[msg.db_name];

                    var find = {};

                    body.updatedAt = moment().format();

                    if (!where && !or && !and) {
                        process.send(
                            {
                                error: response_codes.code_435,
                                end: true,
                            }
                        );
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
                        var inner_or = [];
                        or.fields.map(function (jtem, j) {
                            or.to_find.map(function (item, i) {
                                var ob = {}
                                ob[jtem] = item
                                inner_or.push(ob);
                            });
                        });

                        find = {$or: inner_or};

                    } else if (and) {

                        var inner_and = [];
                        and.fields.map(function (jtem, j) {
                            inner_and.push(jtem);
                        });

                        find = {$and: inner_and};

                    }
                    var query = model.findOne(find);
                    if (select) {
                        if (typeof select == 'string') {
                            select = select.split(',')
                        }

                        var select_obj = select.map(function (item, i) {
                            var ob = {}
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
                        var order = {};
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
                            process.send(
                                {
                                    error: response_codes.code_404,
                                    end: true,
                                }
                            );
                        }


                        for (const [key, val] of Object.entries(body)) {
                            actObj[key] = val;
                        }

                        //only for owner
                        if (who && actObj.owner && who !== '*' && actObj.owner != who) {
                            process.send(
                                {
                                    error: response_codes.code_403,
                                    end: true,
                                }
                            );
                        }

                        var response = await actObj.save();

                        if (!response) {
                            process.send(
                                {
                                    error: response_codes.code_434,
                                    end: true,
                                }
                            );
                            return 0;
                        }

                        process.send(
                            {
                                error: false,
                                end: true,
                                data: response
                            }
                        );

                    } catch (e) {
                        process.send(
                            {
                                error: e,
                                end: true,
                            }
                        );
                        return 0;
                    }

                    break;
                case 'updateOrCreate':
                    var who = msg.who;
                    var {where, body} = msg.data;
                    var model = models[msg.db_name];
                    var find = {};

                    if (where) {
                        for (const [key, val] of Object.entries(where)) {
                            find[key] = val;
                        }
                    }

                    //only for owner
                    if (who && who !== '*') {
                        find['$and'].push({'owner': who})
                    }

                    try {
                        var query = await model.findOne(where);

                        if (!query) {
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
                            process.send(
                                {
                                    error: response_codes.code_436,
                                    end: true
                                }
                            );
                            return 0;
                        }

                        process.send(
                            {
                                error: false,
                                end: true,
                                data: response
                            }
                        );


                    } catch (e) {
                        process.send(
                            {
                                error: e,
                                end: true
                            }
                        );
                        return 0;
                    }


                    break;
                case 'DELETE':
                    var who = msg.who;
                    var model = models[msg.db_name];
                    var id = msg.id;

                    try {
                        var response = await model.findById(id);
                        //only for owner
                        if (who && response.owner && who !== '*' && response.owner !== who) {
                            process.send(
                                {
                                    error: response_codes.code_403,
                                    end: true
                                }
                            );
                        }
                        response = await model.findByIdAndRemove(id);

                        if (!response) {
                            process.send(
                                {
                                    error: response_codes.code_404,
                                    end: true
                                }
                            );
                            return 0;
                        }

                        process.send(
                            {
                                error: false,
                                end: true,
                                data: response
                            }
                        );

                    } catch (e) {
                        process.send(
                            {
                                error: e,
                                end: true
                            }
                        );
                        return 0
                    }
                    break;
                case 'DATATABLE':
                    var who = msg.who;
                    var search_fields = msg.search;
                    var model = models[msg.db_name];


                    var order = {};
                    if (req.body.columns && req.body.order) {
                        req.body.order.map((item, i) => {
                            var name = req.body.columns[item.column].data;
                            var dir = item.dir;
                            order[name] = dir;
                        });
                    }

                    var find = {};


                    //only for owner
                    if (who && who !== '*') {
                        find['owner'] = who.toString();
                    }

                    model.dataTables({
                        limit: req.body.length,
                        skip: req.body.start,
                        search: {
                            value: req.body.search.value,
                            fields: search_fields
                        },
                        sort: order,
                        populate: populate,
                        find
                    }).then(async function (table) {
                        table.success = true;
                        table.message = 'OK';
                        table.recordsTotal = table.total
                        table.recordsFiltered = table.total
                        table.isDT = true;

                        process.send(
                            {
                                error: false,
                                end: true,
                                data: table
                            }
                        );

                    }).catch(function (e) {
                        process.send(
                            {
                                error: e,
                                end: true
                            }
                        );
                    })

                    break;
            }
        } else if (msg.kind == 'FUNCTION') {

            let function_ = msg.function_name;
            let active_function_ = functions[function_];
            await active_function_(msg.req, response_function);
            return 0;
        } else if (msg.kind == 'CRON') {

            console.info('Excecuting function', msg.function_name)
            let function_ = msg.function_name;
            let active_function_ = functions_cron[function_];
            await active_function_();
            console.info('Excecuted function', msg.function_name)
            return 0;
        }
    } catch (e) {
        console.error('Error en child', e)
        process.send(
            {
                error: e,
                end: true
            }
        );
        return 0;
    }
});




