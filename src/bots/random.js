var BaseBot = require("../game/baseBot");

// Create a simple random bot
class RandomBot extends BaseBot {
    start(viewUrl) {
        console.log("Game start. View at:", viewUrl);
    }

    move() {
        var choices = ["North", "East", "South", "West", "Stay"];
        var move = choices[Math.floor(Math.random()*choices.length)];
        console.log("Sent move:", move);
        return move;
    }

    end(winner) {
        if (typeof winner === "string") {
            console.log("Game end. Winner:", winner);
        } else {
            console.log("Game end. Winner:", winner.name);
        }
    }

    crashed(reason) {
        console.error("Game crashed.", reason);
    }
}

module.exports = RandomBot;

