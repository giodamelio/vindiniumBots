var mongoose = require("mongoose");

// Game model
var Game = mongoose.model("Game", {
    // The auth key of the bot
    key: {
        type: String,
        required: false,
        validate: [function(val) {
            return val.length == 8;
        }, "Key must have 8 charcters"]
    },
    // The id of the game on the server
    gameId: {
        type: String
    },
    // The current status of the game
    status: {
        type: String,
        enum: ["pending", "playing", "done", "errored"]
    },
    // Do we have everyones turns, or just ours(the default)
    fullGame: {
        type: Boolean,
        default: false
    },
    // The url of the server the game is on
    server_url: {
        type: String,
        required: true
    },
    // The mode of the game
    mode: {
        type: String,
        enum: ["training", "arena"]
    },
    // The length the game will be
    turns: {
        type: Number
    },
    // The path to the bots source file
    bot_path: {
        type: String
    }
});

module.exports = Game;

