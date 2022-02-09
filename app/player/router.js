const express = require("express");
const router = express.Router();
const { landingPage, detailPage, category } = require("./controller");

router.get("/landing-page", landingPage);
router.get("/:id/detail", detailPage);
router.get("/categories", category);

module.exports = router;
