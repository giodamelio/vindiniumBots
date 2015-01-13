var request = require("request");
var joi = require("joi");

var Game = require("./game");

class Runner {
    constructor(options) {
        // Validate the options
        var optionsSchema = joi.object().keys({
            game: joi
                .object()
                .type(Game)
                .required()
        });
        joi.assert(options, optionsSchema);

        // Add options to class
        this.game = options.game;
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
            // Send start event to the bot
            this.game.bot.start(body.viewUrl);

            // Send out move
            this._respond(body);
        });
    }

    // Make a move
    _respond(state) {
        if (state === "Vindinium - Time out! You must play faster") {
            this.game.bot.crashed("Timeout");
            return;
        }
            
        // If the game is done, exit
        if (state.game.finished) {
            // If we crashed tell the bot
            if (state.hero.crashed) {
                this.game.bot.crashed();

                // Record the state
                this._recordState({
                    rawState: state
                });
                return;
            }

            // Calculate the winner
            // Sort by gold count
            var heroesByGold = state.game.heroes.sort(function(a, b) {
                if (a.gold < b.gold) return 1;
                if (a.gold > b.gold) return -1;
                if (a.gold === b.gold) return 0;
            });
            var winner = heroesByGold[0];

            if (winner.gold === 0) {
                // Draw
                this.game.bot.end("Draw", {});
            } else if (heroesByGold[0].gold === heroesByGold[1].gold) {
                // Two winners = draw
                this.game.bot.end("Draw", {});
            } else {
                // Single winner
                this.game.bot.end(winner.name, winner);
            }

            // Save the state
            this._recordState({
                rawState: state
            });

            return;
        }

        // Get the next turn from the bot
        var move = this.game.bot.move();

        // Save the state and move
        this._recordState(state, move);

        // Send the next turn
        request({
            method: "POST",
            url: state.playUrl,
            json: {
                key: this.game.key,
                dir: move
            }
        }, (error, response, body) => {
            this._respond(body);
        });
    }

    // Save the current state of the game optionally store the move to be made
    _recordState(state, move) {
        this.game.states.push({
            rawState: state,
            move: move
        });
    }
}

module.exports = Runner;

