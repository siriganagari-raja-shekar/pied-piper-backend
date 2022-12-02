
const { body } = require("express-validator");

const emailValidator = body('email').isEmail();
const passwordValidator = body('password').isStrongPassword();

module.exports = {
    emailValidator: emailValidator,
    passwordValidator: passwordValidator
}
