const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("./../Model/userModel");

exports.login = function (req, res, next) {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json(info.message);
    // const payload = {
    //   id: user._id,
    //   //   sub: `${user_id}`,
    // };
    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    req.user = user;
    console.log(user);
    res.status(200).json({
      status: "success",
      token,
      data: {
        user: req.user,
      },
    });
  })(req, res, next);
};

exports.signUp = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      skills: req.body.skills,
    });
    req.user = newUser;
    const token = jwt.sign({ id: newUser._id }, process.env.SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({
      status: "success",
      token,
      data: {
        newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // console.log(req.user, roles);
    console.log("restrict " + req.user);
    if (!req.user || !roles.includes(req.user.role)) {
      next("You are not authorized to perform this request");
      res.status(401).json({
        status: "fail",
        message: "You are not authorized to perform this request",
      });
    }

    next();
  };
};
