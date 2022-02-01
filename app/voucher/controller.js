const Voucher = require("./model");
const Category = require("../category/model");
const Nominal = require("../nominal/model");
const path = require("path");
const fs = require("fs");
const config = require("../../config");

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");

            const alert = { message: alertMessage, status: alertStatus };
            const vouchers = await Voucher.find().populate("category").populate("nominals");

            res.render("admin/vouchers/view_voucher", {
                vouchers,
                alert,
            });
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/voucher");
        }
    },

    viewCreate: async (req, res) => {
        try {
            const categories = await Category.find();
            const nominals = await Nominal.find();

            res.render("admin/vouchers/create", {
                categories,
                nominals,
            });
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/voucher");
        }
    },

    actionCreate: async (req, res) => {
        try {
            const { name, category, nominals } = req.body;

            if (req.file) {
                let tmp_path = req.file.path;
                let originalExt = req.file.originalname.split(".")[req.file.originalname.split(".").length - 1];
                let filename = req.file.filename + "." + originalExt;
                let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`);

                const src = fs.createReadStream(tmp_path);
                const dest = fs.createWriteStream(target_path);

                src.pipe(dest);

                src.on("end", async () => {
                    try {
                        const voucher = new Voucher({
                            name,
                            category,
                            nominals,
                            thumbnail: filename,
                        });

                        await voucher.save();

                        req.flash("alertMessage", "Successfully created voucher");
                        req.flash("alertStatus", "success");

                        res.redirect("/voucher");
                    } catch (err) {
                        req.flash("alertMessage", `${err.message}`);
                        req.flash("alertStatus", "danger");
                        res.redirect("/voucher");
                    }
                });
            } else {
                const voucher = new Voucher({
                    name,
                    category,
                    nominals,
                });

                await voucher.save();

                req.flash("alertMessage", "Successfully created voucher");
                req.flash("alertStatus", "success");

                res.redirect("/voucher");
            }
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/voucher");
        }
    },
};
