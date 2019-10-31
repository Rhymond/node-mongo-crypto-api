const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

mongoose.connect("mongodb://mongodb/database", { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("Connected to mongodb database.");
});

require("./models/item");

const errorHandler = (err, req, res, next) => {
  console.log(err.stack);
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
      status: err.status
    }
  });
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require("./routes"));
app.use(errorHandler);
app.listen(port, () => console.log(`App listening on port ${port}!`));
module.exports = app;
