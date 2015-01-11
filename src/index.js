var path = require("path");

var commander = require("commander");

var version = require("../package.json").version;

var game = require("./game/index.js");

commander
    .version(version);

commander
    .command("server")
    .description("Main game server")
    .option("-c, --config <path>",
            "Set the loacation of the config file. Defaults to ./config.json")
    .action(function(env) {
        // Parse config file
        var configFileLocation =
            env.config || path.join(process.cwd(), "./config.json");
        var config = require(configFileLocation);

        // Start a game
        var newGame = new game.Game(
            config.servers[0].users[0].key,
            config.servers[0].url,
            "training",
            20
        );

        var newGameRunner = new game.GameRunner(newGame);
        newGameRunner.start();
    });

commander
    .parse(process.argv);

