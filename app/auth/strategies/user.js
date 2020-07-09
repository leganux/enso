const express = require('express');
const router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const user = require('./../../models/users.m');
const user_role = require('./../../models/user_roles.m');
const bcrypt = require('bcryptjs');
const env = require('./../../config/environment.config').environment;


passport.use('user-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    async function (req, username, password, done) {

        let app_id = req.params.app_id;

        try {
            let data = await user.findOne({email: username, app: app_id})
                .populate({
                    path: 'role',
                    model: user_role,
                    select: {_id: 1, name: 1, active: 1}
                })
                .select({email: 1, password: 1, username: 1, role: 1, image: 1})
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
                image: data.image,
                user: data._id,
                kind: 'user',
                role: data.role._id,
                role_name: data.role.name,
                role_permission: [],
                user_permission: [],
                app_list: [],
                source: 'Login_strategy'
            }

            done(null, session);
        } catch (e) {
            return done(e);
        }

    })
)


router.post('/:app_id/', passport.authenticate('user-login', {
        failureRedirect: env.root_path,
        failWithError: true
    }),
    function (req, res) {
        res.redirect(env.root_path + env.control_panel_url + 'dashboard');
    });


module.exports = router;