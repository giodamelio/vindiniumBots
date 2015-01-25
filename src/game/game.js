var BaseBot = require("./baseBot");

class Game {
    // Create a new game
    constructor(options) {
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

