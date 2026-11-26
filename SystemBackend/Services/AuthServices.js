const User = require("../Models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );
};

// Register user
exports.registerUser = async (userData) => {
    const { name, email, password, phone } = userData;

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({
        email: normalizedEmail
    });

    if (existingUser) {
        const error = new Error("Email already registered");
        error.status = 409;
        throw error;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        phone,
        role: "user"
    });

    // Generate token
    const token = generateToken(user._id);

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        }
    };
};


// Login user
exports.loginUser = async (email, password) => {

    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({
        email: normalizedEmail
    });

    if (!user) {
        const error = new Error("Invalid email or password");
        error.status = 401;
        throw error;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(
        password,
        user.password
    );

    if (!isValidPassword) {
        const error = new Error("Invalid email or password");
        error.status = 401;
        throw error;
    }

    // Generate JWT
    const token = generateToken(user._id);

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        }
    };
};
