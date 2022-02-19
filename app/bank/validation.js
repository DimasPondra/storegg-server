const { check } = require("express-validator");

const validationCreate = [
    check("name", "name is required").notEmpty(),
    check("bankName", "bank name is required").notEmpty(),
    check("accountNumber", "account number is required").notEmpty(),
];

const validationUpdate = [
    check("name", "name is required").notEmpty(),
    check("bankName", "bank name is required").notEmpty(),
    check("accountNumber", "account number is required").notEmpty(),
];

module.exports = { validationCreate, validationUpdate };
