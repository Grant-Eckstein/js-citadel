const express = require("express");
const router = express.Router();

// Top level routes
router.get("/hello", async (req, res) => {
    res.send("Hello, world!");
});

module.exports = router;