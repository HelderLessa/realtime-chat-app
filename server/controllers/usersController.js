const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validação de campos
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ msg: "All fields are required", status: false });
    }

    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res
        .status(400)
        .json({ msg: "Username already used", status: false });

    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.status(400).json({ msg: "Email already used", status: false });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    user.password = undefined;
    return res.status(201).json({ status: true, user });
  } catch (err) {
    if (err.code === "LIMIT_EXCEEDED") {
      return res.status(429).json({ msg: "Too many requests", status: false });
    }
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validação de campos
    if (!username || !password) {
      return res
        .status(400)
        .json({ msg: "All fields are required", status: false });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "Incorrect username or password", status: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ msg: "Incorrect username or password", status: false });
    }

    user.password = undefined;
    return res.status(200).json({ status: true, user });
  } catch (err) {
    if (err.code === "LIMIT_EXCEEDED") {
      return res.status(429).json({ msg: "Too many requests", status: false });
    }
    next(err);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.params.id;
    const avatarImage = req.body.image;

    if (!userId || !avatarImage) {
      return res
        .status(400)
        .json({ message: "User ID and avatar image are required" });
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(201)
      .json({ isSet: userData.isAvatarImageSet, image: userData.avatarImage });
  } catch (err) {
    if (err.code === "LIMIT_EXCEEDED") {
      return res.status(429).json({ msg: "Too many requests", status: false });
    }
    next(err);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.status(200).json(users);
  } catch (err) {
    if (err.code === "LIMIT_EXCEEDED") {
      return res.status(429).json({ msg: "Too many requests", status: false });
    }
    next(err);
  }
};
