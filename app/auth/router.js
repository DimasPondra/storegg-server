const express = require("express");
const router = express.Router();
const { signup, signin } = require("./controller");
const multer = require("multer");
const os = require("os");
const { validationSignUp } = require("./validation");

router.post("/signup", multer({ dest: os.tmpdir() }).single("avatar"), validationSignUp, signup);
router.post("/signin", signin);

module.exports = router;
