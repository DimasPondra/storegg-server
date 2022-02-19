const { check } = require("express-validator");

const validationCreate = [
    check("type", "payment type is required").notEmpty(),
    check("banks", "bank is required").notEmpty(),
];

const validationUpdate = [
    check("type", "payment type is required").notEmpty(),
    check("banks", "bank is required").notEmpty(),
];

module.exports = { validationCreate, validationUpdate };
