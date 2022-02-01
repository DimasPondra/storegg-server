const express = require("express");
const router = express.Router();
const { index, viewCreate, actionCreate, viewEdit, actionEdit } = require("./controller");

router.get("/", index);
router.get("/create", viewCreate);
router.post("/create", actionCreate);
router.get("/edit/:id", viewEdit);
router.put("/edit/:id", actionEdit);

module.exports = router;
