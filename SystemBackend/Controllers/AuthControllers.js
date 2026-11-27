
const AuthServices = require("../Services/AuthServices");

// Environment-aware cookie configuration
const getCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === "production";

    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/"
    };
};

// Register
exports.register = async (req, res, next) => {
    try {
        const result = await AuthServices.registerUser(req.body);

        res.cookie("token", result.token, getCookieOptions());

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: result.user
        });

    } catch (error) {
        next(error);
    }
};

// Login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error("Email and password are required");
            error.status = 400;
            throw error;
        }

        const result = await AuthServices.loginUser(email, password);

        res.cookie("token", result.token, getCookieOptions());

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: result.user
        });

    } catch (error) {
        next(error);
    }
};

// Logout
exports.logout = async (req, res, next) => {
    try {
        const { path, ...cookieOptions } = getCookieOptions();

        res.clearCookie("token", {
            ...cookieOptions,
            path
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch (error) {
        next(error);
    }
};
