var joi = require("joi");

var BaseBot = require("./baseBot");

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
                .optional(),
            bot: joi
                .object()
                .type(BaseBot)
                .required()
        });
        joi.assert(options, optionsSchema);

        // Add options to class
        this.name = options.name;
        this.key = options.key;
        this.server_url = options.server_url;
        this.mode = options.mode;
        this.turns = options.turns;
        this.bot = options.bot;

        // Keep track of turns
        this.states = [];
    }
}

module.exports = Game;

