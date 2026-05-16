const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.login = async (req, res, next) => {
    try {
        const { identifier, password, role } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide identifier and password"
            });
        }

        const user = await User.findOne({
            $or: [
                { email: identifier.toString().toLowerCase() },
                { mobile: identifier.toString() }
            ]
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // If role is provided, check if it matches
        if (role && user.role !== role) {
            return res.status(403).json({
                success: false,
                message: `Access denied: This account is registered as ${user.role}.`
            });
        }

        if (user.status !== "active") {
            return res.status(403).json({
                success: false,
                message: `Account is ${user.status}. Please contact support.`
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not set in environment variables");
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Don't send password in response
        user.password = undefined;

        res.json({
            success: true,
            token,
            user
        });
    } catch (err) {
        console.error("LOGIN ERROR => ", err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

exports.logout = async (req, res, next) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (err) {
        console.error("LOGOUT ERROR => ", err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};