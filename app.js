const express = require("express");
const userRoute = require("./Routes/userRoutes");
const passport = require("./Controller/passport");

const app = express();

// app.use(morgan());
app.use(express.json());

app.get("/", (req, res) => {
  console.log(`Hello from the server`);
  res.status(200).json({
    status: "success",
    message: "Hello from the server",
  });
});

app.use("/users", userRoute);

module.exports = app;
