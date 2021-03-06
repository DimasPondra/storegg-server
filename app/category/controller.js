const Category = require("./model");
const { validationResult } = require("express-validator");

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");

            const alert = { message: alertMessage, status: alertStatus };
            const categories = await Category.find();

            res.render("admin/categories/view_category", {
                categories,
                alert,
                name: req.session.user.name,
                active: "category",
            });
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/category");
        }
    },

    viewCreate: async (req, res) => {
        try {
            res.render("admin/categories/create", {
                name: req.session.user.name,
                active: "category",
            });
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/category");
        }
    },

    actionCreate: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.render("admin/categories/create", {
                    name: req.session.user.name,
                    active: "category",
                    errors: errors.array(),
                });
            }

            const { name } = req.body;

            let category = await Category({ name });
            await category.save();

            req.flash("alertMessage", "Successfully created category");
            req.flash("alertStatus", "success");

            res.redirect("/category");
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/category");
        }
    },

    viewEdit: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await Category.findOne({ _id: id });

            res.render("admin/categories/edit", {
                category,
                name: req.session.user.name,
                active: "category",
            });
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/category");
        }
    },

    actionEdit: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await Category.findOne({ _id: id });

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.render("admin/categories/edit", {
                    category,
                    name: req.session.user.name,
                    active: "category",
                    errors: errors.array(),
                });
            }

            const { name } = req.body;

            await Category.findOneAndUpdate({ _id: id }, { name });

            req.flash("alertMessage", "Successfully updated category");
            req.flash("alertStatus", "success");

            res.redirect("/category");
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/category");
        }
    },

    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;

            await Category.findOneAndRemove({ _id: id });

            req.flash("alertMessage", "Successfully deleted category");
            req.flash("alertStatus", "success");

            res.redirect("/category");
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/category");
        }
    },
};
