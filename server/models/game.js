const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  gameId: String,
  users: Array,
  options: {
      maxPlayers: Number,
      numRules: Number,
      timePerTurn: Number,
  },
});

// compile model from schema
module.exports = mongoose.model("game", GameSchema);