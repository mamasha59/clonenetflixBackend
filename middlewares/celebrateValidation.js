const {celebrate, Joi} = require('celebrate');
const router = require('../routes/routes');

module.exports.validationCreateUser = celebrate({
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(5)
    })
})

module.exports.validationLogIn = celebrate({
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(5)
    })
})