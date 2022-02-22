const { check } = require("express-validator");

const validationCreate = [
    check("name", "name is required").notEmpty().isLength({ min: 3 }).withMessage("name min 3 character"),
    check("accountUser", "account user is required")
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("account user min 3 character"),
    check("nominal", "nominal is required").notEmpty(),
    check("voucher", "voucher is required").notEmpty(),
    check("payment", "payment is required").notEmpty(),
    check("bank", "bank is required").notEmpty(),
];

module.exports = { validationCreate };
