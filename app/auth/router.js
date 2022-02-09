const express = require("express");
const router = express.Router();
const { Signup } = require("./controller");
const multer = require("multer");
const os = require("os");

router.post("/signup", multer({ dest: os.tmpdir() }).single("avatar"), Signup);

module.exports = router;
