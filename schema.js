const Joi = require('joi');

module.exports.SchoolSchema = Joi.object({
   
    school:Joi.object({
        name:Joi.string().required(),
        address:Joi.string().required(),
        latitude:Joi.number().min(0).required(),
        longitude:Joi.number().min(0).required()
    })
    
})