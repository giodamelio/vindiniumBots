var path = require("path");

var r = require("rethinkdb");
var jayschema = require("jayschema");
var suspend = require("suspend");

var Game = require("../../game/game");
var Runner = require("../../game/runner");
var BaseBot = require("../../game/baseBot");
var GameSchema = require("../../schemas/game");

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

            // Connect to rethinkdb
            var conn = yield r.connect({
                db: "vindiniumBots"
            });

            // Query the db every second and check for new games to start
            var id = setInterval(suspend(function*() {
                // Get all pending games
                var cursor = yield r
                    .table("Games")
                    .filter({
                        status: "pending"
                    }).run(conn);

                try {
                    // Get one game
                    var gameInfo = yield cursor.next();

                    // Validate the game info
                    var validator = new jayschema();
                    var errs = validator.validate(gameInfo, GameSchema);
                    if (errs.length > 0) {
                        throw errs;
                    }

                    // Set the status to playing
                    yield r
                        .table("Games")
                        .get(gameInfo.id)
                        .update({
                            status: "playing"
                        }).run(conn);

                    // Create a new game
                    var game = new Game(gameInfo);
                    var runner = new Runner({
                        log, game
                    });
                    runner.start();
                } catch (err) {
                    if (err.name === "RqlDriverError" &&
                            err.message === "No more rows in the cursor.") {
                        return;
                    } else {
                        log.error(err);
                    }
                } finally {
                    cursor.close();
                }
            }), 1000);

            // Listen for Control-C and close nicely
            process.on("SIGINT", function() {
                log.info("Shutting down");
                clearInterval(id);
                conn.close();
                process.exit();
            });
        }));
};
