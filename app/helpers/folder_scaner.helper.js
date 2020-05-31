const fs = require('fs')
var path = require('path');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const stat_ = util.promisify(fs.stat);

var walk2 = async function (dir, results, find, remove_join) {
    if (!results) {
        results = [];
    }
    try {
        let list = await readdir(dir);
        var pending = list.length;
        if (!pending) {
            return results;
        }
        for (var i = 0; i < list.length; i++) {
            var file = list[i];
            file = await path.resolve(dir, file);
            let stat = await stat_(file);
            if (stat && stat.isDirectory()) {
                let res = await walk2(file, results, find, remove_join);
                results = results.concat(res);
            } else {
                if (find) {
                    if (file.includes(find)) {
                        if (remove_join) {
                            results.push(file.replace(remove_join, ''));
                        } else {
                            results.push(file);
                        }
                    }
                } else {
                    if (remove_join) {
                        results.push(file.replace(remove_join, ''));
                    } else {
                        results.push(file);
                    }
                }

            }
        }
        return results;
    } catch (err) {
        console.error(err);
        throw  err;
    }
};

var walk2model = async function (dir, results, find, remove_join, model, base_url) {
    if (!results) {
        results = [];
    }

    try {
        let list = await readdir(dir);
        var pending = list.length;
        if (!pending) {
            return results;
        }
        for (var i = 0; i < list.length; i++) {
            var file = list[i];
            file = await path.resolve(dir, file);
            let stat = await stat_(file);
            if (stat && stat.isDirectory()) {
                await walk2model(file, results, find, remove_join, model, base_url);
            } else {
                if (find) {
                    if (file.includes(find)) {
                        if (remove_join) {
                            let file_item = new model({
                                url: base_url + file.replace(remove_join, ''),
                                path: file,
                                type: find
                            });
                            let sve = await file_item.save();


                        }
                    }
                } else {
                    if (remove_join) {
                        let file_item = new model({
                            url: base_url + file.replace(remove_join, ''),
                            path: file,
                            type: find
                        });
                        let sve = await file_item.save();

                    }
                }

            }
        }
        return results;
    } catch (err) {
        console.error(err);
        throw  err;
    }
};


module.exports = {walk2, walk2model}