const express = require("express");
const router = express.Router();
const { index, viewCreate, actionCreate, viewEdit, actionEdit, actionDelete } = require("./controller");
const { isLoginAdmin } = require("../middleware/auth");
const { validationCreate, validationUpdate } = require("./validation");

router.use(isLoginAdmin);
router.get("/", index);
router.get("/create", viewCreate);
router.post("/create", validationCreate, actionCreate);
router.get("/edit/:id", viewEdit);
router.put("/edit/:id", validationUpdate, actionEdit);
router.delete("/delete/:id", actionDelete);

module.exports = router;
