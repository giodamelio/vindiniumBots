var request = require("request");

class Runner {
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
            this._respond(body);
        });
    }

    // Make a move
    _respond(state) {
        // If the game is done, exit
        if (state.game.finished) {
            return;
        }

        // Get the next turn from the bot
        var move = this.game.bot.move();

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
}

module.exports = Runner;

