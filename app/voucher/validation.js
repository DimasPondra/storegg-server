const { check } = require("express-validator");

const validationCreate = [
    check("name", "game name is required").notEmpty(),
    check("category", "category is required").notEmpty(),
    check("nominals", "nominal is required").notEmpty(),
];

const validationUpdate = [
    check("name", "game name is required").notEmpty(),
    check("category", "category is required").notEmpty(),
    check("nominals", "nominal is required").notEmpty(),
];

module.exports = { validationCreate, validationUpdate };
