const { Pool } = require("pg");

let pool;

const getDbPool = () => {
    if (!pool) {
        pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
        });
    }
    return pool;
};

module.exports = getDbPool;
