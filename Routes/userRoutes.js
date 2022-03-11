const express = require("express");
const userController = require("../Controller/userController");
const authController = require("../Controller/authController");
// const passport = require("./../Controller/passport");
const passport = require("passport");

const router = express.Router();

router.route("/signUp").post(authController.signUp);
router.route("/login").post(authController.login);

router
  .route("/")
  .get(
    passport.authenticate("jwt", { session: false }),
    authController.restrictTo("admin"),
    userController.getAllUser
  )
  .post(
    passport.authenticate("jwt", { session: false }),
    authController.restrictTo("admin"),
    userController.createUser
  );

router
  .route("/:id")
  .get(
    passport.authenticate("jwt", { session: false }),
    authController.restrictTo("admin"),
    userController.getUser
  )
  .patch(
    passport.authenticate("jwt", { session: false }),
    userController.updateUser
  )
  .delete(
    passport.authenticate("jwt", { session: false }),
    authController.restrictTo("admin"),
    userController.deleteUser
  );

module.exports = router;
