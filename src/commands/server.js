var path = require("path");

var r = require("rethinkdb");
var jayschema = require("jayschema");

var Game = require("../game/game");
var Runner = require("../game/runner");
var BaseBot = require("../game/baseBot");
var GameSchema = require("../schemas/game");

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

            //Connect to rethinkdb
            r.connect({
                db: "vindiniumBots"
            }).then(function(conn) {
                // Query the db every second and check for new games to start
                setInterval(() => {
                    r
                        .table("Games")
                        .filter(
                            r.row("status").eq("pending")
                        )
                        .run(conn)
                        .then(function(cursor) {
                            cursor.each(function(error, pendingGame) {
                                if (error) {
                                    log.error(error);
                                    return;
                                }

                                // Validate the game
                                 var validator = new jayschema();
                                 var errs = validator.validate(pendingGame, GameSchema);
                                 if (errs.length > 0) {
                                     log.error(errs);
                                     return;
                                 }

                                 // Change status to playing
                                 r
                                     .table("Games")
                                     .get(pendingGame.id)
                                     .update({
                                         status: "playing"
                                     })
                                    .run(conn)
                                    .then(function() {
                                        // Start a game
                                        var game = new Game(pendingGame);
                                        var runner = new Runner({
                                            game, log
                                        });
                                        runner.start();
                                    });
                            });
                        });
                }, 1000);
            }).error(function(error) {
                throw error;
            });
        });
};

