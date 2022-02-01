const express = require("express");
const router = express.Router();
const { index, viewCreate, actionCreate } = require("./controller");
const multer = require("multer");
const os = require("os");

router.get("/", index);
router.get("/create", viewCreate);
router.post("/create", multer({ dest: os.tmpdir() }).single("thumbnail"), actionCreate);

module.exports = router;
