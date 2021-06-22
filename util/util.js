const { validationResult } = require('express-validator');
exports.validationBulder= function(req){
    return validationResult(req).errors.map((e)=>{
        console.log(e);
        return req.flash('message',{class:'error',text:e.param+': '+e.msg});
    });
}