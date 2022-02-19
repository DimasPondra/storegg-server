const Nominal = require("./model");
const { validationResult } = require("express-validator");

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");

            const alert = { message: alertMessage, status: alertStatus };
            const nominals = await Nominal.find();

            res.render("admin/nominals/view_nominal", {
                nominals,
                alert,
                name: req.session.user.name,
                active: "nominal",
            });
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/nominal");
        }
    },

    viewCreate: async (req, res) => {
        try {
            res.render("admin/nominals/create", {
                name: req.session.user.name,
                active: "nominal",
            });
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/nominal");
        }
    },

    actionCreate: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.render("admin/nominals/create", {
                    name: req.session.user.name,
                    active: "nominal",
                    errors: errors.array(),
                });
            }

            const { coinName, coinQuantity, price } = req.body;

            let nominal = await Nominal({ coinName, coinQuantity, price });
            await nominal.save();

            req.flash("alertMessage", "Successfully created nominal");
            req.flash("alertStatus", "success");

            res.redirect("/nominal");
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/nominal");
        }
    },

    viewEdit: async (req, res) => {
        try {
            const { id } = req.params;
            const nominal = await Nominal.findOne({ _id: id });

            res.render("admin/nominals/edit", {
                nominal,
                name: req.session.user.name,
                active: "nominal",
            });
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/nominal");
        }
    },

    actionEdit: async (req, res) => {
        try {
            const { id } = req.params;
            const nominal = await Nominal.findOne({ _id: id });

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.render("admin/nominals/edit", {
                    nominal,
                    name: req.session.user.name,
                    active: "nominal",
                    errors: errors.array(),
                });
            }

            const { coinName, coinQuantity, price } = req.body;

            await Nominal.findOneAndUpdate({ _id: id }, { coinName, coinQuantity, price });

            req.flash("alertMessage", "Successfully updated nominal");
            req.flash("alertStatus", "success");

            res.redirect("/nominal");
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/nominal");
        }
    },

    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;

            await Nominal.findOneAndRemove({ _id: id });

            req.flash("alertMessage", "Successfully deleted nominal");
            req.flash("alertStatus", "success");

            res.redirect("/nominal");
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/nominal");
        }
    },
};
