const express = require('express');
const router = express.Router();

const admin = require('./../../models/core/admin.m');
const admin_role = require('./../../models/core/admin_role.m');
const bcrypt = require('bcryptjs');
const env = require('./../../config/environment.config').environment;
const jwt = require('jsonwebtoken')
const response_codes = require("../../helpers/response_codes.helper").codes

router.post('/',async (req,res)=>{
    console.log(req.body)
    let {username,password} = req.body
    console.log(username)
    console.log(password)

    try{
        let data
        if(username && username.includes("@") && username.includes(".com") ){
             data = await admin.findOne({email: username}) .populate({
                 path: 'role',
                 model: admin_role,
                 select: {_id: 1, name: 1, active: 1}
             })
                 .select({email: 1, password: 1, username: 1, role: 1, image: 1})
                 .exec();
        }else{
             data = await admin.findOne({username: username}) .populate({
                 path: 'role',
                 model: admin_role,
                 select: {_id: 1, name: 1, active: 1}
             })
                 .select({email: 1, password: 1, username: 1, role: 1, image: 1})
                 .exec();
        }
        if(!data){
            return done(null, false);
        }
        if (!data.role || !data.role.active) {
            return done(null, false);
        }

        let rescompare = await bcrypt.compare(password, data.password);
        if (!rescompare) {
            return done(null, false);
        }

        data.password = null;


        let session = {
            username: data.username,
            email: data.email,
            image: data.image,
            user: data._id,
            kind: 'admin',
            role: data.role._id,
            role_name: data.role.name,
            role_permission: [],
            user_permission: [],
            app_list: []
        }

        var token = jwt.sign(session, env.JWT_Secret, {expiresIn: '1h'});

        console.log(token)
        var ret = response_codes.code_200;
        ret.data = token;

        if(token){
            res.status(200).json(ret);
        }


    }catch (e){
        console.log(e)
        return res.status(200).send("Usuario o contraseña no es valido")
    }


})

/*router.post('/', passport.authenticate('admin-login', {
        failureRedirect: env.root_path + env.control_panel_url,
        failWithError: true
    }),
    function (req, res) {
        res.redirect(env.root_path + env.control_panel_url + 'dashboard');
    });*/


module.exports = router;