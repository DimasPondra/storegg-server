const mongoose = require("mongoose");

let paymentSchema = mongoose.Schema({
    type: {
        type: String,
        require: [true, "type is required"],
    },
    status: {
        type: String,
        enum: ["Y", "N"],
        default: "Y",
    },
    banks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bank",
        },
    ],
});

module.exports = mongoose.model("Payment", paymentSchema);
