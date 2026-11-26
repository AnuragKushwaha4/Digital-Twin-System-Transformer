const jwt = require("jsonwebtoken");

const Authorized = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            const error = new Error("Authentication required");
            error.status = 401;
            throw error;
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {
        if (error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError") {
            error.status = 401;
            error.message = "Invalid or expired token";
        }

        next(error);
    }
};

module.exports = Authorized;
