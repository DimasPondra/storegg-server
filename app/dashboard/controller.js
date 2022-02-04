const Transaction = require("../transaction/model");
const Voucher = require("../voucher/model");
const Player = require("../player/model");
const Category = require("../category/model");

module.exports = {
    index: async (req, res) => {
        try {
            const transactions = await Transaction.count();
            const vouchers = await Voucher.count();
            const players = await Player.count();
            const categories = await Category.count();

            res.render("admin/dashboard/view_dashboard", {
                count: {
                    transactions,
                    vouchers,
                    players,
                    categories,
                },
                name: req.session.user.name,
                active: "dashboard",
            });
        } catch (err) {
            console.log(err);
        }
    },
};
