var path = require("path");

var mongoose = require("mongoose");
var suspend = require("suspend");

var Game = require("../../game");
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
                    // Get the current game
                    var currentGame = yield Models.Game
                        .findById(pendingGameData._id)
                        .exec();

                    // Set the status to playing
                    yield currentGame
                        .update({ status: "playing" })
                        .exec();

                    // Create a new game
                    log.info("Starting game");
                    var game = new Game(pendingGameData, log);

                    // Add game id to db
                    game.on("start", suspend(function*(state) {
                        yield currentGame
                            .update({ gameId: state.game.id })
                            .exec();
                    }));

                    // Handle crashes
                    game.on("crash", suspend(function*() {
                        yield currentGame
                            .update({ status: "crashed" })
                            .exec();
                    }));

                    // Handle game end
                    game.on("end", suspend(function*(winner) {
                        yield currentGame
                            .update({ status: "done" })
                            .exec();
                    }));

                    // Start the game
                    game.start();
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
