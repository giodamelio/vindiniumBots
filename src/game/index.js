var request = require("request");

class Game {
    // Create a new game
    constructor(key, url, mode="arena", turns=undefined, map=undefined) {
        this.key = key;
        this.url = url;
        this.mode = mode;
        this.turns = turns;
        this.map = map;
    }

    // Start the game
    start() {
        var self = this;
        request({
            method: "POST",
            url: this.url + "/api/" + this.mode,
            json: {
                key: this.key,
                turns: this.turns,
                map: this.map
            }
        }, function(error, response, body) {
            console.log(body.viewUrl);
            self._respond(body);
        });
    }

    // Make a move
    _respond(state) {
        var self = this;

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
                key: this.key,
                dir: "Stay"
            }
        }, function(error, response, body) {
            self._respond(body);
        });
    }
}

module.exports = Game;

