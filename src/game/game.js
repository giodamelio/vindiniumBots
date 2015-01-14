var jayschema = require("jayschema");

var BaseBot = require("./baseBot");
var GameSchema = require("../schemas/game");

class Game {
    // Create a new game
    constructor(options) {
        // Validate options
        var validator = new jayschema();
        var errs = validator.validate(options, GameSchema);
        if (errs.length > 0) {
            throw err;
        }

        // Add options to class
        this.key = options.key;
        this.server_url = options.server_url;
        this.mode = options.mode;
        this.turns = options.turns;
        this.bot_path = options.bot_path;

        // Keep track of turns
        this.states = [];
    }
}

module.exports = Game;

