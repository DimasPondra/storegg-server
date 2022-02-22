const express = require("express");
const router = express.Router();
const {
    landingPage,
    detailPage,
    category,
    checkout,
    history,
    detailHistory,
    dashboard,
    profile,
    editProfile,
} = require("./controller");
const multer = require("multer");
const os = require("os");
const { isLoginPlayer } = require("../middleware/auth");
const { validationCreate } = require("../transaction/validation");

router.get("/landing-page", landingPage);
router.get("/:id/detail", detailPage);
router.get("/categories", category);
router.post("/checkout", isLoginPlayer, validationCreate, checkout);
router.get("/history", isLoginPlayer, history);
router.get("/history/:id/detail", isLoginPlayer, detailHistory);
router.get("/dashboard", isLoginPlayer, dashboard);
router.get("/profile", isLoginPlayer, profile);
router.put("/profile", isLoginPlayer, multer({ dest: os.tmpdir() }).single("avatar"), editProfile);

module.exports = router;
