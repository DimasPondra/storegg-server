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

    viewEdit: async (req, res) => {
        try {
            const banks = await Bank.find();

            const { id } = req.params;
            const payment = await Payment.findOne({ _id: id });

            res.render("admin/payments/edit", {
                payment,
                banks,
            });
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/payment");
        }
    },

    actionEdit: async (req, res) => {
        try {
            const { id } = req.params;
            const { type, banks } = req.body;

            await Payment.findOneAndUpdate({ _id: id }, { type, banks });

            req.flash("alertMessage", "Successfully updated payment");
            req.flash("alertStatus", "success");

            res.redirect("/payment");
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/payment");
        }
    },

    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;

            await Payment.findOneAndRemove({ _id: id });

            req.flash("alertMessage", "Successfully deleted payment");
            req.flash("alertStatus", "success");

            res.redirect("/payment");
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/payment");
        }
    },
};
