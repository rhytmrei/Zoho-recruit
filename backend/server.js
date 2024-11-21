require("dotenv").config();
const express = require("express");
const session = require('express-session');
const cors = require("cors");

const getDbPool = require("./utils/db");

const app = express();
const port = process.env.PORT || 5050;

app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: false,
            sameSite: 'None',
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
);

app.locals.db = getDbPool();
app.locals.db.connect((err) => {
    if (err) {
        console.error("Database connection error:", err.message);
    } else {
        console.log("Connected to PostgreSQL");
    }
});

app.use("/auth", require("./routes/auth"));

app.use("/positions", require("./routes/positions"));

app.use("/stages", require("./routes/stages"));

app.use("/applications", require("./routes/applications"));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
