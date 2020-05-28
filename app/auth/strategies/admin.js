const express = require('express');
const router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const admin = require('./../../models/core/admin.m');
const bcrypt = require('bcryptjs');
const env = require('./../../config/environment.config').environment;


passport.use('admin-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    },
    async function (username, password, done) {
        console.log('|||||||||| llega', username, password)
        try {
            let data = await admin.findOne({email: username});

            if (!data) {
                return done(null, false);
            }
            let res = await bcrypt.compare(password, data.password);
            if (!res) {
                return done(null, false);
            }
            let session = {
                session: data,
                kind: 'admin',
                role: data.role
            }
            console.log('|||||||||| SES', session)
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