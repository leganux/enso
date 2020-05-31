const express = require('express');
const router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const admin = require('./../../models/core/admin.m');
const admin_role = require('./../../models/core/admin_role.m');
const bcrypt = require('bcryptjs');
const env = require('./../../config/environment.config').environment;


passport.use('admin-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    },
    async function (username, password, done) {

        try {
            let data = await admin.findOne({email: username})
                .populate({
                    path: 'role',
                    model: admin_role,
                    select: {_id: 1, name: 1, active: 1}
                })
                .select({email: 1, password: 1, username: 1, role: 1})
                .exec();

            if (!data) {
                return done(null, false);
            }
            if (!data.role || !data.role.active) {
                return done(null, false);
            }
            let res = await bcrypt.compare(password, data.password);
            if (!res) {
                return done(null, false);
            }

            data.password = null;


            let session = {
                username: data.username,
                email: data.email,
                user: data._id,
                kind: 'admin',
                role: data.role._id,
                role_name: data.role._id,
                role_permission: [],
                user_permission: [],
                app_list: []
            }

            done(null, session);
        } catch (e) {
            return done(e);
        }

    })
)


router.post('/', passport.authenticate('admin-login', {
        failureRedirect: env.root_path + env.control_panel_url,
        failWithError: true
    }),
    function (req, res) {
        res.redirect(env.root_path + env.control_panel_url + 'dashboard');
    });


module.exports = router;