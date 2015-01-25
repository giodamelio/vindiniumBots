var mongoose = require("mongoose");

// Game model
var Game = mongoose.model("Game", {
    key: {
        type: String,
        required: false,
        unique: true,
        validate: [function(val) {
            return val.length == 8;
        }, "Key must have 8 charcters"]
    },
    status: {
        type: String,
        enum: ["pending", "playing", "done", "errored"]
    },
    server_url: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        enum: ["training", "arena"]
    },
    turns: {
        type: Number
    },
    bot_path: {
        type: String
    }
});

module.exports = Game;

