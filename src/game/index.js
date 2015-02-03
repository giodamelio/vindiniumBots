var EventEmitter = require("events").EventEmitter;

var request = require("request");

var BaseBot = require("./baseBot");

class Game extends EventEmitter {
    // Create a new game
    constructor(options) {
        // Add options to class
        this.key = options.key;
        this.server_url = options.server_url;
        this.mode = options.mode;
        this.length = options.length;

        // Get the bot from the fs
        var bot = require(options.bot_path);
        this.bot = new bot();

        // Keep track of turns
        this.turns = [];
    }

        // Start the game
    start() {
        request({
            method: "POST",
            url: this.server_url + "/api/" + this.mode,
            json: {
                key: this.key,
                turns: this.length,
                map: this.map
            }
        }, (error, response, body) => {
            // Send start event to the bot
            this.bot.start(body.viewUrl);
            this.emit("start", body);

            // Send out move
            this._respond(body);
        });
    }

    // Make a move
    _respond(state) {
        if (state === "Vindinium - Time out! You must play faster") {
            this.bot.crashed("Timeout");
            this.emit("crash", "Timeout");
            return;
        }
            
        // If the game is done, exit
        if (state.game.finished) {
            // If we crashed tell the bot
            if (state.hero.crashed) {
                this.bot.crashed();
                this.emit("crash");

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
                this.bot.end("Draw");
                this.emit("end", "Draw");
            } else if (heroesByGold[0].gold === heroesByGold[1].gold) {
                // Two winners = draw
                this.bot.end("Draw");
                this.emit("end", "Draw");
            } else {
                // Single winner
                this.bot.end(winner);
                this.emit("end", winner);
            }

            // Save the state
            this._recordState({
                rawState: state
            }); 

            return;
        }

        // Get the next turn from the bot
        var move = this.bot.move();
        this.emit("move", state, move);

        // Save the state and move
        this._recordState(state, move);

        // Send the next turn
        request({
            method: "POST",
            url: state.playUrl,
            json: {
                key: this.key,
                dir: move
            }
        }, (error, response, body) => {
            this._respond(body);
        });
    }

    // Save the current state of the game optionally store the move to be made
    _recordState(state, move) {
        this.turns.push({
            rawState: state,
            move: move
        });
    }
}

module.exports = Game;

