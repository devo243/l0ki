const mongoose = require("mongoose");

const DeckSchema = new mongoose.Schema({
  gameId: String,
  cards: Array,
  userId: String,
});

// compile model from schema
module.exports = mongoose.model("deck", DeckSchema);