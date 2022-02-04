const mongoose = require("mongoose");

let userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            require: [true, "name is required"],
            minLength: [3, "min 3 characters"],
            maxLength: [255, "max 255 characters"],
        },
        username: {
            type: String,
            require: [true, "username is required"],
            minLength: [3, "min 3 characters"],
            maxLength: [255, "max 255 characters"],
        },
        email: {
            type: String,
            require: [true, "email is required"],
        },
        password: {
            type: String,
            require: [true, "password is required"],
            minLength: [6, "min 6 characters"],
            maxLength: [16, "max 16 characters"],
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "admin",
        },
        status: {
            type: String,
            enum: ["Y", "N"],
            default: "Y",
        },
        phoneNumber: {
            type: String,
            require: [true, "phone number is required"],
            minLength: [9, "min 9 characters"],
            maxLength: [13, "max 13 characters"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
