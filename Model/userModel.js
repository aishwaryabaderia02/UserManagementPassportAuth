const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please provide email address."],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email address."],
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please provide password"],
  },
  active: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    enum: {
      values: ["user", "admin"],
      message: "Role can be only of type 'user' and 'admin'",
    },
    default: "user",
  },
  skills: [String],
});

UserSchema.pre("save", function (next) {
  if (this.password === this.passwordConfirm) {
    next();
  } else {
    throw new Error("Password do not match");
  }
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
