const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ errors: ["Access denied"] });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {

        const user = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });

        const newToken = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(422).json({ new_token: newToken });
    }
};

module.exports = authMiddleware;
