
const AuthServices = require("../Services/AuthServices");

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000
};

// Register
exports.register = async (req, res, next) => {
    try {
        const result = await AuthServices.registerUser(req.body);

        res.cookie("token", result.token, cookieOptions);

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

        res.cookie("token", result.token, cookieOptions);

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
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch (error) {
        next(error);
    }
};
