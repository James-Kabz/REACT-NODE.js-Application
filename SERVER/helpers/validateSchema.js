const Joi = require('joi');

const authSchema = Joi.object({
    admin_email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).required(), 

})

module.exports = authSchema;