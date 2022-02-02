const Payment = require("./model");
const Bank = require("../bank/model");

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");

            const alert = { message: alertMessage, status: alertStatus };
            const payments = await Payment.find().populate("banks");

            res.render("admin/payments/view_payment", {
                payments,
                alert,
            });
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/payment");
        }
    },

    viewCreate: async (req, res) => {
        try {
            const banks = await Bank.find();

            res.render("admin/payments/create", {
                banks,
            });
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/payment");
        }
    },

    actionCreate: async (req, res) => {
        try {
            const { type, status, banks } = req.body;

            let payment = await Payment({ type, status, banks });
            await payment.save();

            req.flash("alertMessage", "Successfully created payment");
            req.flash("alertStatus", "success");

            res.redirect("/payment");
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/payment");
        }
    },
};
