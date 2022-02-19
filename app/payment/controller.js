const Payment = require("./model");
const Bank = require("../bank/model");
const { validationResult } = require("express-validator");

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
                name: req.session.user.name,
                active: "payment",
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
                name: req.session.user.name,
                active: "payment",
            });
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/payment");
        }
    },

    actionCreate: async (req, res) => {
        try {
            const allBanks = await Bank.find();

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.render("admin/payments/create", {
                    banks: allBanks,
                    name: req.session.user.name,
                    active: "payment",
                    errors: errors.array(),
                });
            }

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
                name: req.session.user.name,
                active: "payment",
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
            const payment = await Payment.findOne({ _id: id });
            const allBanks = await Bank.find();

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.render("admin/payments/edit", {
                    payment,
                    banks: allBanks,
                    name: req.session.user.name,
                    active: "payment",
                    errors: errors.array(),
                });
            }

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

    actionStatus: async (req, res) => {
        try {
            const { id } = req.params;

            let payment = await Payment.findOne({ _id: id });

            let status = payment.status === "Y" ? "N" : "Y";

            await Payment.findOneAndUpdate({ _id: id }, { status });

            req.flash("alertMessage", "Successfully updated status payment");
            req.flash("alertStatus", "success");

            res.redirect("/payment");
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/payment");
        }
    },
};
