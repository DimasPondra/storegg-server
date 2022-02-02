const mongoose = require("mongoose");

let bankSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, "name is required"],
    },
    bankName: {
        type: String,
        require: [true, "bank name is required"],
    },
    accountNumber: {
        type: String,
        require: [true, "account number is required"],
    },
});

module.exports = mongoose.model("Bank", bankSchema);
