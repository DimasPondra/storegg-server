const mongoose = require("mongoose");

let playerSchema = mongoose.Schema(
    {
        name: {
            type: String,
            require: [true, "name is required"],
        },
        username: {
            type: String,
            require: [true, "username is required"],
        },
        avatar: {
            type: String,
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
            default: "user",
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

module.exports = mongoose.model("Player", playerSchema);
