const express = require('express');
const router = express.Router();
const api_crud = require('../helpers/api_crud_constructor_app.helper');
const contact_group = require('../models/contact_group.m');
const contact = require('../models/contacts.m');
const access_middleware = require('./../auth/auth.middleware').auth
const app = require('./../models/core/app.m')
var path = require('path');
const fs = require('fs');
const {fork} = require('child_process');
const { findOne, remove } = require('./../models/core/app.m');
const response_codes = require('./../helpers/response_codes.helper').codes;

//api_crud.all(router, contact_group, access_middleware, false, 'name');


var get_app_id = function (req) {
    if (!req.params || !req.params.app_id) {
        return false;
    } else {
        return req.params.app_id;
    }
}

router.delete('/:app_id/:id', async (req,res)=>{
    try{
        var groupSelect = req.params.id;
        if(!get_app_id(req)){
            res.status(533).json(response_codes.code_533)
            return 0;
        }


        let inContactGroup = await contact.find({
            group : groupSelect
        }) ;

        for(let item of inContactGroup){
         await  item.remove()
        }

        let contactGroup = await contact_group.findByIdAndRemove(groupSelect);
       
        let ret = response_codes.code_200;
        ret.data = {parent:contactGroup,children:inContactGroup};
        res.status(200).json(ret);
        return 0;
    }
    catch(e){
        console.error(e)
       
        res.status(500).json(response_codes.code_500);
        return 0;
    }
    

    
})


api_crud.create(router, contact_group, access_middleware);
api_crud.update(router, contact_group, access_middleware);
api_crud.updateWhere(router, contact_group, access_middleware);
api_crud.readOne(router, contact_group, access_middleware, false);
api_crud.readById(router, contact_group, access_middleware, false);
api_crud.read(router, contact_group, access_middleware, false);
api_crud.updateOrCreate(router, contact_group, access_middleware);
api_crud.datatable(router, contact_group, access_middleware, false, 'name');



module.exports = router;
