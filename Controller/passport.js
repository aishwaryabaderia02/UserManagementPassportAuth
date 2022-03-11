const passport = require("passport");
const passportJWT = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const User = require("./../Model/userModel");

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (email, password, cb) {
      //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
      return User.findOne({ email })
        .then((user) => {
          if (!user) {
            return cb(null, false, { message: "Incorrect email or password." });
          }

          bcrypt.compare(password, user.password).then((pass) => {
            if (!pass) {
              cb(null, false, { message: "Incorrect email or password." });
            }
            console.log(user);
            return cb(null, user, { message: "Logged In Successfully" });
          });
        })
        .catch((err) => cb(err));
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "my-very-long-secret-key",
    },
    function (jwtPayload, cb) {
      console.log(jwtPayload);
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      return User.findById(jwtPayload.id)
        .then((user) => {
          return cb(null, user);
        })
        .catch((err) => {
          return cb(err);
        });
    }
  )
);
