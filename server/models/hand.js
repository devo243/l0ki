const mongoose = require("mongoose");

const HandSchema = new mongoose.Schema({
  playerId: String,
  gameId: String,
  cards: Array,
});

// compile model from schema
module.exports = mongoose.model("hand", HandSchema);