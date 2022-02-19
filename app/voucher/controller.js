const Voucher = require("./model");
const Category = require("../category/model");
const Nominal = require("../nominal/model");
const path = require("path");
const fs = require("fs");
const config = require("../../config");
const { validationResult } = require("express-validator");

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
                name: req.session.user.name,
                active: "voucher",
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
                name: req.session.user.name,
                active: "voucher",
            });
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/voucher");
        }
    },

    actionCreate: async (req, res) => {
        try {
            const categories = await Category.find();
            const allNominals = await Nominal.find();

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.render("admin/vouchers/create", {
                    categories,
                    nominals: allNominals,
                    name: req.session.user.name,
                    active: "voucher",
                    errors: errors.array(),
                });
            }

            const user = req.session.user.id;
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
                            user,
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
                    user,
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

    viewEdit: async (req, res) => {
        try {
            const categories = await Category.find();
            const nominals = await Nominal.find();

            const { id } = req.params;
            const voucher = await Voucher.findOne({ _id: id }).populate("category").populate("nominals");

            res.render("admin/vouchers/edit", {
                voucher,
                categories,
                nominals,
                name: req.session.user.name,
                active: "voucher",
            });
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/voucher");
        }
    },

    actionEdit: async (req, res) => {
        try {
            const categories = await Category.find();
            const allNominals = await Nominal.find();

            const { id } = req.params;
            const voucher = await Voucher.findOne({ _id: id }).populate("category").populate("nominals");

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.render("admin/vouchers/edit", {
                    voucher,
                    categories,
                    nominals: allNominals,
                    name: req.session.user.name,
                    active: "voucher",
                    errors: errors.array(),
                });
            }

            const user = req.session.user.id;
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
                        const voucher = await Voucher.findOne({ _id: id });

                        let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;

                        if (fs.existsSync(currentImage)) {
                            fs.unlinkSync(currentImage);
                        }

                        await Voucher.findOneAndUpdate(
                            { _id: id },
                            {
                                name,
                                category,
                                nominals,
                                thumbnail: filename,
                                user,
                            }
                        );

                        req.flash("alertMessage", "Successfully updated voucher");
                        req.flash("alertStatus", "success");

                        res.redirect("/voucher");
                    } catch (err) {
                        req.flash("alertMessage", `${err.message}`);
                        req.flash("alertStatus", "danger");
                        res.redirect("/voucher");
                    }
                });
            } else {
                await Voucher.findOneAndUpdate(
                    { _id: id },
                    {
                        name,
                        category,
                        nominals,
                        user,
                    }
                );

                req.flash("alertMessage", "Successfully updated voucher");
                req.flash("alertStatus", "success");

                res.redirect("/voucher");
            }
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/voucher");
        }
    },

    actionDelete: async (req, res) => {
        try {
            const { id } = req.params;

            const voucher = await Voucher.findOneAndRemove({ _id: id });

            let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;

            if (fs.existsSync(currentImage)) {
                fs.unlinkSync(currentImage);
            }

            req.flash("alertMessage", "Successfully deleted voucher");
            req.flash("alertStatus", "success");

            res.redirect("/voucher");
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/voucher");
        }
    },

    actionStatus: async (req, res) => {
        try {
            const { id } = req.params;

            let voucher = await Voucher.findOne({ _id: id });

            let status = voucher.status === "Y" ? "N" : "Y";

            await Voucher.findOneAndUpdate(
                { _id: id },
                {
                    status,
                }
            );

            req.flash("alertMessage", "Successfully updated status voucher");
            req.flash("alertStatus", "success");

            res.redirect("/voucher");
        } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/voucher");
        }
    },
};
