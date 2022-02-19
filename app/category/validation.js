const { check } = require("express-validator");

const validationCreate = [check("name", "name is required").notEmpty()];
const validationUpdate = [check("name", "name is required").notEmpty()];

module.exports = { validationCreate, validationUpdate };
