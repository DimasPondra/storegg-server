const mongoose = require("mongoose");

let playerSchema = mongoose.Schema(
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
        avatar: {
            type: String,
        },
        fileName: {
            type: String,
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
            minLength: [9, "min 9 characters"],
            maxLength: [13, "max 13 characters"],
        },
        favorite: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Player", playerSchema);
