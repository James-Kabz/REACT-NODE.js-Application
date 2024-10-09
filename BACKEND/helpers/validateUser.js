const Joi = require('joi');

const userSchema = Joi.object({
    user_email: Joi.string().email().lowercase().required(), 
    password: Joi.string().min(8).required(), 

})

module.exports = userSchema;