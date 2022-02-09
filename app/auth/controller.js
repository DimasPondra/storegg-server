const Player = require("../player/model");
const path = require("path");
const fs = require("fs");
const config = require("../../config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
    signup: async (req, res, next) => {
        try {
            const { name, username, email, password } = req.body;

            const checkPlayer = await Player.findOne({ email: email });

            if (checkPlayer) {
                return res.status(500).json({ message: "email is registered" });
            }

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
                        const player = new Player({
                            name,
                            username,
                            email,
                            password,
                            avatar: filename,
                        });

                        await player.save();

                        delete player._doc.password;

                        res.status(201).json({ data: player });
                    } catch (err) {
                        if (err && err.name === "ValidationError") {
                            return res.status(422).json({
                                message: err.message,
                                fields: err.errors,
                            });
                        }
                        next(err);
                    }
                });
            } else {
                let player = new Player({
                    name,
                    username,
                    email,
                    password,
                });

                await player.save();

                delete player._doc.password;

                res.status(201).json({ data: player });
            }
        } catch (err) {
            if (err && err.name === "ValidationError") {
                return res.status(422).json({
                    message: err.message,
                    fields: err.errors,
                });
            }
            next(err);
        }
    },

    signin: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const player = await Player.findOne({ email: email });

            if (!player) {
                return res.status(403).json({ message: "email is wrong" });
            }

            const checkPassword = bcrypt.compareSync(password, player.password);

            if (!checkPassword) {
                return res.status(403).json({ message: "password is wrong" });
            }

            const token = jwt.sign(
                {
                    player: {
                        id: player.id,
                        name: player.name,
                        username: player.username,
                        email: player.email,
                        avatar: player.avatar,
                    },
                },
                config.jwtKey
            );
            res.status(200).json({ data: token });
        } catch (err) {
            res.status(500).json({
                message: err.message || "Internal server error",
            });
            next();
        }
    },
};
