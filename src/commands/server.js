var path = require("path");

var Game = require("../game/game");
var Runner = require("../game/runner");
var BaseBot = require("../game/baseBot");

module.exports = function(commander, log) {
    commander
        .command("server")
        .description("Main game server")
        .option("-c, --config <path>", "Set the loacation of the config file. Defaults to ./config.json")
        .action(function(env) {
            // Parse config file
            var configFileLocation =
                env.config || path.join(process.cwd(), "./config.json");
            var config = require(configFileLocation);

            // Create a simple random bot
            class RandomBot extends BaseBot {
                start(viewUrl) {
                    log.info("Game start. View at:", viewUrl);
                }

                move() {
                    var choices = ["North", "East", "South", "West", "Stay"];
                    var move = choices[Math.floor(Math.random()*choices.length)];
                    log.info("Sent move:", move);
                    return move;
                }

                end(winner) {
                    if (typeof winner === "string") {
                        log.info("Game end. Winner:", winner);
                    } else {
                        log.info("Game end. Winner:", winner.name);
                    }
                }

                crashed(reason) {
                    log.error("Game crashed.", reason);
                }
            }

            // Start a game
            var game = new Game({
                name: "giodamelio",
                key: config.servers[0].users[0].key,
                server_url: config.servers[0].url,
                mode: "training",
                turns: 20,
                bot: new RandomBot()
            });

            var runner = new Runner({
                game
            });
            runner.start();
        });
};

