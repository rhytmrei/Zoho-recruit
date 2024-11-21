const { refreshAccessToken } = require('../utils/zoho');

const checkZohoAccessToken = async (req, res, next) => {
    const accessToken = req.session.zoho_access_token;
    const tokenExpiresAt = req.session.zoho_token_expires_at;

    if (!accessToken || Date.now() >= tokenExpiresAt) {
        console.log('Access token expired or not found, refreshing...');

        const refreshed = await refreshAccessToken(req);

        if (!refreshed) {
            return res.status(401).json({ error: 'Failed to refresh access token' });
        }
    }

    next();
}

module.exports = checkZohoAccessToken;