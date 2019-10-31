const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    _id: String,
    value: String,
    encryption_key: String
  },
  { versionKey: false }
);

module.exports = mongoose.model("Item", itemSchema);
