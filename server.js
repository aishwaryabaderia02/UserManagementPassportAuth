const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = require("./app");

dotenv.config({ path: "./config.env" });

const url = process.env.URL.replace("<username>", process.env.USERNAME).replace(
  "<password>",
  process.env.PASSWORD
);

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(console.log("Database connection establised"))
  .catch((err) => console.log("Can't connect to server " + err));

const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log("App running on port " + port);
});
