const express = require("express");

const positions = require("../utils/positions");

const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/all", authMiddleware, (req, res) => {
    res.json(Object.keys(positions));
});

router.get("/skills/:position", (req, res) => {
    const position = req.params.position;
    const skills = positions[position];

    if (!skills) {
        return res.status(404).json({ error: "Position not found" });
    }

    res.json(skills);
});

module.exports = router;