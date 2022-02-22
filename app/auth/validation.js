const { check } = require("express-validator");

const validationSignUp = [
    check("name", "name is required").notEmpty().isLength({ min: 3 }).withMessage("name min 3 character"),
    check("username", "username is required").notEmpty().isLength({ min: 3 }).withMessage("username min 3 character"),
    check("email", "email is required").notEmpty().isEmail().withMessage("Not an email"),
    check("password", "password is required")
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage("password min 6 character")
        .isLength({ max: 16 })
        .withMessage("password max 16 character"),
    check("phoneNumber", "phone number is required")
        .notEmpty()
        .isLength({ min: 9 })
        .withMessage("phone number min 9 character")
        .isMobilePhone(["id-ID"])
        .withMessage("is not indonesian phone number")
        .isLength({ max: 13 })
        .withMessage("phone number max 13 character"),
];

module.exports = { validationSignUp };
