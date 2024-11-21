const express = require("express");
const {validationResult} = require("express-validator");
const axios = require('axios');
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({storage});

const router = express.Router();

const authMiddleware = require("../middleware/auth");

const {
    firstStageValidation,
    secondStageValidation,
} = require("../utils/validations/stages");
const checkZohoAccessToken = require("../middleware/zoho");

router.post("/first", authMiddleware, firstStageValidation, (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    res.status(200).json({req: req.body});
});

router.post("/second", authMiddleware, secondStageValidation, (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    res.status(200).json({req: req.body});
});

router.post("/confirm", authMiddleware, checkZohoAccessToken, upload.single("resume"), async (req, res) => {
    const resume = req.file;

    const application = JSON.parse(req.body.data);

    const pool = req.app.locals.db;

    application.submitter_id = req.user.id;

    const keys = Object.keys(application);
    const values = Object.values(application);

    const columns = keys.join(', ');
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');

    try {
        const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [
            req.user.id,
        ]);

        if (userCheck.rowCount === 0) {
            return res.status(404).json({success: false, error: 'User not found'});
        }

        const result = await pool.query(
            `INSERT INTO candidates (${columns})
             VALUES (${placeholders}) RETURNING *`,
            values
        );

        res.status(201).json({success: true, data: result.rows[0]});

    } catch (err) {
        console.error(err.message);
        res.status(500).json({success: false, error: 'Server error'});
    }

    application.Skill_Set = application.Skill_Set?.join(', ');

    try {
        const candidateData = {
            data: [application],
        };

        const url = 'https://recruit.zoho.eu/recruit/v2/Candidates';
        const accessToken = req.session.zoho_access_token;

        const response = await axios.post(url, candidateData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }).then(async (response) => {
            const candidate = (response.data.data[0].details.id);
            const formData = new FormData();
            formData.append("file", new Blob([resume.buffer]), resume.originalname);

            await axios.post(`${url}/${candidate}/Attachments?attachments_category=Resume`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            })
        });

    } catch (error) {
        console.error('Some error happened:', error.response ? error.response.data : error.message);
    }

});

module.exports = router;