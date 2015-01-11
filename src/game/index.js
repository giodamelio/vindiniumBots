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
            url: this.game.url + "/api/" + this.game.mode,
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

