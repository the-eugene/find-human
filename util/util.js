const { validationResult } = require('express-validator');
exports.validationBulder= function(req){
    validationResult(req).errors.map((e)=>{
        req.flash('message',{class:'error',text:e.param+': '+e.msg});
    });
}