const Bank = require("./model");
const { validationResult } = require("express-validator");

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");

            const alert = { message: alertMessage, status: alertStatus };
            const banks = await Bank.find();

            res.render("admin/banks/view_bank", {
                banks,
                alert,
                name: req.session.user.name,
                active: "bank",
            });
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/bank");
        }
    },

    viewCreate: async (req, res) => {
        try {
            res.render("admin/banks/create", {
                name: req.session.user.name,
                active: "bank",
            });
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/bank");
        }
    },

    actionCreate: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.render("admin/banks/create", {
                    name: req.session.user.name,
                    active: "bank",
                    errors: errors.array(),
                });
            }

            const { name, bankName, accountNumber } = req.body;

            let bank = await Bank({ name, bankName, accountNumber });
            await bank.save();

            req.flash("alertMessage", "Successfully created bank");
            req.flash("alertStatus", "success");

            res.redirect("/bank");
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/bank");
        }
    },

    viewEdit: async (req, res) => {
        try {
            const { id } = req.params;
            const bank = await Bank.findOne({ _id: id });

            res.render("admin/banks/edit", {
                bank,
                name: req.session.user.name,
                active: "bank",
            });
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/bank");
        }
    },

    actionEdit: async (req, res) => {
        try {
            const { id } = req.params;
            const bank = await Bank.findOne({ _id: id });

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.render("admin/banks/edit", {
                    bank,
                    name: req.session.user.name,
                    active: "bank",
                    errors: errors.array(),
                });
            }

            const { name, bankName, accountNumber } = req.body;

            await Bank.findOneAndUpdate({ _id: id }, { name, bankName, accountNumber });

            req.flash("alertMessage", "Successfully updated bank");
            req.flash("alertStatus", "success");

            res.redirect("/bank");
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/bank");
        }
    },

    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;

            await Bank.findOneAndRemove({ _id: id });

            req.flash("alertMessage", "Successfully deleted bank");
            req.flash("alertStatus", "success");

            res.redirect("/bank");
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/bank");
        }
    },
};
