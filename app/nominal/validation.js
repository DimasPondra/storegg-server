const { check } = require("express-validator");

const validationCreate = [
    check("coinName", "coin name is required").notEmpty(),
    check("coinQuantity", "coin quantity must be an integer").isInt(),
    check("price", "price must be an integer").isInt(),
];

const validationUpdate = [
    check("coinName", "coin name is required").notEmpty(),
    check("coinQuantity", "coin quantity is required and must be an integer").isInt(),
    check("price", "price is required and must be an integer").isInt(),
];

module.exports = { validationCreate, validationUpdate };
