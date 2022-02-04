const mongoose = require("mongoose");

let transactionSchema = mongoose.Schema(
    {
        name: {
            type: String,
            require: [true, "name is required"],
            minLength: [3, "min 3 characters"],
            maxLength: [255, "max 255 characters"],
        },
        accountUser: {
            type: String,
            require: [true, "account name is required"],
            minLength: [3, "min 3 characters"],
            maxLength: [255, "max 255 characters"],
        },
        tax: {
            type: Number,
            default: 0,
        },
        value: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["pending", "success", "failed"],
            default: "pending",
        },
        historyVoucherTopup: {
            gameName: { type: String, require: [true, "game name is required"] },
            category: { type: String, require: [true, "category is required"] },
            thumbnail: { type: String },
            coinName: { type: String, require: [true, "coin name is required"] },
            coinQuantity: { type: String, require: [true, "coin quantity is required"] },
            price: { type: Number },
        },
        historyPayment: {
            type: { type: String, require: [true, "type payment is required"] },
            bankName: { type: String, require: [true, "bank name is required"] },
            name: { type: String, require: [true, "account name is required"] },
            accountNumber: { type: String, require: [true, "account number is required"] },
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        historyUser: {
            name: { type: String, require: [true, "player name is required"] },
            phoneNumber: {
                type: Number,
                require: [true, "phone number is required"],
                minLength: [9, "min 9 characters"],
                maxLength: [13, "max 13 characters"],
            },
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
        voucherTopup: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Voucher",
        },
        player: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Player",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
