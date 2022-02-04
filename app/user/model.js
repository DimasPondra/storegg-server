const mongoose = require("mongoose");

let userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            require: [true, "name is required"],
        },
        email: {
            type: String,
            require: [true, "email is required"],
        },
        password: {
            type: String,
            require: [true, "password is required"],
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
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
