var request = require("request");
var joi = require("joi");

class Game {
    // Create a new game
    constructor(options) {
        // Validate options
        var optionsSchema = joi.object().keys({
            name: joi
                .string()
                .required(),
            key: joi
                .string()
                .length(8)
                .required(),
            server_url: joi
                .string()
                .required(),
            mode: joi
                .string()
                .allow("training", "arena")
                .default("training")
                .optional(),
            turns: joi
                .number()
                .optional()
        });
        joi.assert(options, optionsSchema);

        // Add options to class
        this.name = options.name;
        this.key = options.key;
        this.server_url = options.server_url;
        this.mode = options.mode;
        this.turns = options.turns;
    }
}

module.exports.Game = Game;

class GameRunner {
    constructor(game) {
        this.game = game;
    }
    
    // Start the game
    start() {
        request({
            method: "POST",
            url: this.game.server_url + "/api/" + this.game.mode,
            json: {
                key: this.game.key,
                turns: this.game.turns,
                map: this.game.map
            }
        }, (error, response, body) => {
            console.log(body.viewUrl);
            this._respond(body);
        });
    }

    // Make a move
    _respond(state) {
        // If the game is done, exit
        if (state.game.finished) {
            console.log("Game finished");
            return;
        }

        // Send the next turn
        console.log("Sending move: stay");
        request({
            method: "POST",
            url: state.playUrl,
            json: {
                key: this.game.key,
                dir: "Stay"
            }
        }, (error, response, body) => {
            this._respond(body);
        });
    }
}

module.exports.GameRunner = GameRunner;

