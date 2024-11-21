const express = require("express");

const { query, validationResult } = require("express-validator");

const authMiddleware = require("../middleware/auth");
const checkZohoAccessToken = require("../middleware/zoho");

const router = express.Router();

router.get("/list", authMiddleware, async (req, res) => {
    const pool = req.app.locals.db;

    try {
        const query = `
            SELECT 
                id, 
                created_at, 
                CONCAT(first_name, ' ', last_name) AS full_name, 
                position
            FROM candidates
            ORDER BY created_at DESC
        `;
        const result = await pool.query(query);

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching applicants:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get(
    '/get',
    authMiddleware,
    checkZohoAccessToken,
    [
        query('id').isInt().withMessage('ID must be an integer').toInt(),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.query.id;
        const userId = req.user.id;
        const pool = req.app.locals.db;

        try {
            const query = `
                SELECT *
                FROM candidates
                WHERE id = $1 AND submitter_id = $2
            `;

            const result = await pool.query(query, [id, userId]);

            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'Record not found or access denied' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error('Error fetching record:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
);

module.exports = router;