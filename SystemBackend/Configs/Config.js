
require("dotenv").config();

const config = Object.freeze({
    port: process.env.PORT || 3000,

    DBURL: process.env.MONGODB_URL,

    JWT_SECRET: process.env.JWT_SECRET,

    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",

    NODE_ENV: process.env.NODE_ENV || "development"
});

// Validate required environment variables
if (!config.DBURL) {
    throw new Error("MONGODB_URL is missing in environment variables");
}

if (!config.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in environment variables");
}

module.exports = config;
