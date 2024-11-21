const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const router = express.Router();

router.post("/register", [
    body("login").isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
], async (req, res) => {
    const { login, password } = req.body;
    const pool = req.app.locals.db;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array().map(err => err.msg) });
    }

    if (!login || !password) {
        return res.status(400).json({ error: "Login and password are required" });
    }

    try {
        const userCheck = await pool.query("SELECT * FROM users WHERE login = $1", [login]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query("INSERT INTO users (login, password) VALUES ($1, $2)", [login, hashedPassword]);
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/login", async (req, res) => {
    const { login, password } = req.body;
    const pool = req.app.locals.db;

    if (!login || !password) {
        return res.status(400).json({ error: "Login and password are required" });
    }

    try {
        const user = await pool.query("SELECT * FROM users WHERE login = $1", [login]);
        if (user.rows.length === 0) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
