var path = require("path");

var mongoose = require("mongoose");
var suspend = require("suspend");

var Game = require("../../game/game");
var Runner = require("../../game/runner");
var BaseBot = require("../../game/baseBot");
var Models = require("../../models");

module.exports = function(commander, log) {
    commander
        .command("server")
        .description("Main game server")
        .option("-c, --config <path>", "Set the loacation of the config file. Defaults to ./config.json")
        .action(suspend(function*(env) {
            // Parse config file
            var configFileLocation =
                env.config || path.join(process.cwd(), "./config.json");
            var config = require(configFileLocation);

            // Connect to mongodb
            mongoose.connect("mongodb://localhost/vindiniumBots");
           
            // Query the db every second and check for new games to start
            var id = setInterval(suspend(function*() {
                // Look for games with a status of pending
                var pendingGameData = yield Models.Game
                    .findOne({ status: "pending" })
                    .exec();

                if (pendingGameData) {
                    // Set the status to playing
                    log.info("Setting status to \"playing\"");
                    var tmp = yield Models.Game
                        .findByIdAndUpdate(
                                pendingGameData._id,
                                { status: "playing" }
                        )
                        .exec();

                    // Create a new game
                    log.info("Starting game");
                    var game = new Game(pendingGameData);
                    var runner = new Runner({
                        log, game
                    });
                    runner.start();
                }
            }), 1000);

            // Listen for Control-C and close nicely
            process.on("SIGINT", function() {
                log.info("Shutting down");
                clearInterval(id);
                process.exit();
            });
        }));
};
