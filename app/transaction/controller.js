const Transaction = require("./model");

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");

            const alert = { message: alertMessage, status: alertStatus };
            const transactions = await Transaction.find().populate("player");

            res.render("admin/transactions/view_transaction", {
                transactions,
                alert,
                name: req.session.user.name,
                active: "transaction",
            });
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/transaction");
        }
    },

    actionStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.query;

            await Transaction.findOneAndUpdate({ _id: id }, { status });

            req.flash("alertMessage", "Successfully updated status transaction");
            req.flash("alertStatus", "success");

            res.redirect("/transaction");
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/transaction");
        }
    },
};
