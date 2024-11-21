const axios = require('axios');

const storeSessionData = (req, data) => {
    req.session.zoho_access_token = data.access_token;
    req.session.zoho_api_domain = data.api_domain;
    req.session.zoho_token_expires_at = Date.now() + data.expires_in * 1000;
}

const requestAccessToken = async(params) => {
    try {
        const response = await axios.post(
            'https://accounts.zoho.eu/oauth/v2/token',
            new URLSearchParams(params).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        if (response.status === 200) {
            return response.data;
        }

        return null;
    } catch (error) {
        console.error('Error requesting access token:', error.response?.data || error.message);
        return null;
    }
}

const refreshAccessToken = async(req) => {
    const refreshToken = process.env.ZOHO_REFRESH_TOKEN;

    if (!refreshToken) {
        console.error('No refresh token found in session');
        return false;
    }

    const data = await requestAccessToken({
        grant_type: 'refresh_token',
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        refresh_token: refreshToken,
    });

    if (data) {
        storeSessionData(req, data);
        console.log('Access token refreshed successfully');
        return true;
    }

    console.error('Failed to refresh access token');
    return false;
}

module.exports = {
    refreshAccessToken,
};
