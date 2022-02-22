const Player = require("./model");
const Voucher = require("../voucher/model");
const Category = require("../category/model");
const Nominal = require("../nominal/model");
const Payment = require("../payment/model");
const Bank = require("../bank/model");
const Transaction = require("../transaction/model");
const path = require("path");
const fs = require("fs");
const config = require("../../config");
const { validationResult } = require("express-validator");

module.exports = {
    landingPage: async (req, res) => {
        try {
            const vouchers = await Voucher.find().select("_id name status category thumbnail").populate("category");

            res.status(200).json({ data: vouchers });
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal server error" });
        }
    },

    detailPage: async (req, res) => {
        try {
            const { id } = req.params;
            const voucher = await Voucher.findOne({ _id: id })
                .populate("category")
                .populate("nominals")
                .populate("user", "_id name phoneNumber");

            if (!voucher) {
                res.status(404).json({ message: "Voucher not found!" });
            }

            res.status(200).json({ data: voucher });
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal server error" });
        }
    },

    category: async (req, res) => {
        try {
            const categories = await Category.find().select("_id name");

            res.status(200).json({ data: categories });
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal server error" });
        }
    },

    checkout: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(500).json({
                    message: "Something wrong",
                    errors: errors.array(),
                });
            }

            const { accountUser, name, nominal, voucher, payment, bank } = req.body;

            const res_voucher = await Voucher.findOne({ _id: voucher })
                .select("_id name category thumbnail user")
                .populate("category")
                .populate("user");

            if (!res_voucher) return res.status(404).json({ message: "voucher not found" });

            const res_nominal = await Nominal.findOne({ _id: nominal });

            if (!res_nominal) return res.status(404).json({ message: "nominal not found" });

            const res_payment = await Payment.findOne({ _id: payment });

            if (!res_payment) return res.status(404).json({ message: "payment not found" });

            const res_bank = await Bank.findOne({ _id: bank });

            if (!res_bank) return res.status(404).json({ message: "bank not found" });

            let tax = (10 / 100) * res_nominal._doc.price;
            let value = res_nominal._doc.price + tax;

            const payload = {
                name,
                accountUser,
                tax,
                value,

                historyVoucherTopup: {
                    gameName: res_voucher._doc.name,
                    category: res_voucher._doc.category.name,
                    thumbnail: res_voucher._doc.thumbnail,
                    coinName: res_nominal._doc.coinName,
                    coinQuantity: res_nominal._doc.coinQuantity,
                    price: res_nominal._doc.price,
                },
                historyPayment: {
                    type: res_payment._doc.type,
                    bankName: res_bank._doc.bankName,
                    name: res_bank._doc.name,
                    accountNumber: res_bank._doc.accountNumber,
                },
                historyUser: {
                    name: res_voucher._doc.user.name,
                    phoneNumber: res_voucher._doc.user.phoneNumber,
                },

                user: res_voucher._doc.user._id,
                category: res_voucher._doc.category._id,
                voucherTopup: res_voucher._doc._id,
                player: req.player._id,
            };

            const transaction = new Transaction(payload);
            await transaction.save();

            res.status(200).json({ message: "successfully checkout item." });
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal server error" });
        }
    },

    history: async (req, res) => {
        try {
            const { status = "" } = req.query;

            let criteria = {};

            if (status.length) {
                criteria = {
                    ...criteria,
                    status: { $regex: `${status}`, $options: "i" },
                };
            }

            if (req.player._id) {
                criteria = {
                    ...criteria,
                    player: req.player._id,
                };
            }

            const history = await Transaction.find(criteria);

            let total = await Transaction.aggregate([
                { $match: criteria },
                {
                    $group: {
                        _id: null,
                        value: { $sum: "$value" },
                    },
                },
            ]);

            res.status(200).json({
                data: history,
                total: total.length ? total[0].value : 0,
            });
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal server error" });
        }
    },

    detailHistory: async (req, res) => {
        try {
            const { id } = req.params;

            const history = await Transaction.findOne({ _id: id });

            if (!history) res.status(404).json({ message: "history not found" });

            res.status(200).json({ data: history });
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal server error" });
        }
    },

    dashboard: async (req, res) => {
        try {
            const count = await Transaction.aggregate([
                { $match: { player: req.player._id } },
                {
                    $group: {
                        _id: "$category",
                        value: { $sum: "$value" },
                    },
                },
            ]);

            const categories = await Category.find();

            categories.forEach((category) => {
                count.forEach((item) => {
                    if (item._id.toString() === category._id.toString()) {
                        item.name = category.name;
                    }
                });
            });

            const history = await Transaction.find({ player: req.player._id })
                .populate("category")
                .sort({ updatedAt: -1 });

            res.status(200).json({ data: history, count: count });
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal server error" });
        }
    },

    profile: async (req, res) => {
        try {
            const player = {
                id: req.player._id,
                name: req.player.name,
                username: req.player.username,
                email: req.player.email,
                avatar: req.player.avatar,
                phone_number: req.player.phoneNumber,
            };

            res.status(200).json({ data: player });
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal server error" });
        }
    },

    editProfile: async (req, res) => {
        try {
            const { name = "", phoneNumber = "" } = req.body;

            const payload = {};

            if (name.length) payload.name = name;
            if (phoneNumber.length) payload.phoneNumber = phoneNumber;

            if (req.file) {
                let tmp_path = req.file.path;
                let originalExt = req.file.originalname.split(".")[req.file.originalname.split(".").length - 1];
                let filename = req.file.filename + "." + originalExt;
                let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`);

                const src = fs.createReadStream(tmp_path);
                const dest = fs.createWriteStream(target_path);

                src.pipe(dest);

                src.on("end", async () => {
                    let player = await Player.findOne({ _id: req.player._id });

                    let currentImage = `${config.rootPath}/public/uploads/${player.avatar}`;

                    if (fs.existsSync(currentImage)) {
                        fs.unlinkSync(currentImage);
                    }

                    player = await Player.findOneAndUpdate(
                        { _id: req.player._id },
                        {
                            ...payload,
                            avatar: filename,
                        },
                        { new: true, runValidators: true }
                    );

                    res.status(201).json({
                        data: {
                            id: player._id,
                            name: player.name,
                            phoneNumber: player.phoneNumber,
                            avatar: player.avatar,
                        },
                    });
                });

                src.on("err", async () => {
                    next(err);
                });
            } else {
                const player = await Player.findOneAndUpdate(
                    {
                        _id: req.player._id,
                    },
                    payload,
                    { new: true, runValidators: true }
                );

                res.status(201).json({
                    data: {
                        id: player._id,
                        name: player.name,
                        phoneNumber: player.phoneNumber,
                        avatar: player.avatar,
                    },
                });
            }
        } catch (err) {
            if (err && err.name === "ValidationError") {
                res.status(422).json({
                    error: 1,
                    message: err.message,
                    fields: err.errors,
                });
            }
        }
    },
};
