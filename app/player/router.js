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
} = require("./controller");
const { isLoginPlayer } = require("../middleware/auth");

router.get("/landing-page", landingPage);
router.get("/:id/detail", detailPage);
router.get("/categories", category);
router.post("/checkout", isLoginPlayer, checkout);
router.get("/history", isLoginPlayer, history);
router.get("/history/:id/detail", isLoginPlayer, detailHistory);
router.get("/dashboard", isLoginPlayer, dashboard);
router.get("/profile", isLoginPlayer, profile);

module.exports = router;
