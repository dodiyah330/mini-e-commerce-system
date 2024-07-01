const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { registerValidation, loginValidation } = require("../utils/validation");

exports.register = async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists)
    return res.status(400).json({ message: "Email already exists" });

  const usernameExists = await User.findOne({ username: req.body.username });
  if (usernameExists)
    return res.status(400).json({ message: "Username already exists" });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    access_token: jwt.sign({ _id: req.body.email }, process.env.TOKEN_SECRET, {
      expiresIn: "1h",
    }),
    refresh_token: jwt.sign(
      { _id: req.body.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    ),
  });

  try {
    const savedUser = await user.save();
    res.status(201).json({ user: savedUser._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).json({ message: "Email or password is wrong" });

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).json({ message: "Invalid password" });

  const accessToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  res.header("auth-token", accessToken).json({
    accessToken,
    refreshToken,
  });
};
