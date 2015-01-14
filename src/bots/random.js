var BaseBot = require("../game/baseBot");

// Create a simple random bot
class RandomBot extends BaseBot {
    start(viewUrl) {
        this.log.info("Game start. View at:", viewUrl);
    }

    move() {
        var choices = ["North", "East", "South", "West", "Stay"];
        var move = choices[Math.floor(Math.random()*choices.length)];
        this.log.info("Sent move:", move);
        return move;
    }

    end(winner) {
        if (typeof winner === "string") {
            this.log.info("Game end. Winner:", winner);
        } else {
            this.log.info("Game end. Winner:", winner.name);
        }
    }

    crashed(reason) {
        this.log.error("Game crashed.", reason);
    }
}

module.exports = RandomBot;

