const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema({
  name: String,
  content: String,
});

// compile model from schema
module.exports = mongoose.model("test", TestSchema);