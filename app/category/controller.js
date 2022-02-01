const Category = require("./model");

module.exports = {
    index: async (req, res) => {
        try {
            const categories = await Category.find();

            res.render("admin/categories/view_category", {
                categories,
            });
        } catch (err) {
            console.log(err);
        }
    },

    viewCreate: async (req, res) => {
        try {
            res.render("admin/categories/create");
        } catch (err) {
            console.log(err);
        }
    },

    actionCreate: async (req, res) => {
        try {
            const { name } = req.body;

            let category = await Category({ name });
            await category.save();

            res.redirect("/category");
        } catch (err) {
            console.log(err);
        }
    },

    viewEdit: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await Category.findOne({ _id: id });

            res.render("admin/categories/edit", {
                category,
            });
        } catch (err) {
            console.log(err);
        }
    },

    actionEdit: async (req, res) => {
        try {
            const { id } = req.params;
            const { name } = req.body;

            const category = await Category.findOneAndUpdate({ _id: id }, { name });

            res.redirect("/category");
        } catch (err) {
            console.log(err);
        }
    },
};
