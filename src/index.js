var path = require("path");

var commander = require("commander");

var version = require("../package.json").version;

var Game = require("./game/index.js");

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
        var game = new Game(config.servers[0].users[0].key, 20);
    });

commander
    .parse(process.argv);

