const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            lowercase: true,
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please fill a valid email address",
            ],
        },
        mobile: {
            type: String,
            unique: true,
            sparse: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 4,
            select: false,
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "admin",
        },
        status: {
            type: String,
            enum: ["active", "inactive", "suspended"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
