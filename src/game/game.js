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

module.exports = Game;

