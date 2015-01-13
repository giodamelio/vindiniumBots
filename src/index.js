var path = require("path");

var commander = require("commander");

var version = require("../package.json").version;

var Game = require("./game/game");
var Runner = require("./game/runner");
var BaseBot = require("./game/baseBot");

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

        // Create a simple bot
        class StayBot extends BaseBot {
        }

        // Start a game
        var game = new Game({
            name: "giodamelio",
            key: config.servers[0].users[0].key,
            server_url: config.servers[0].url,
            mode: "training",
            turns: 20,
            bot: new StayBot()
        });

        var runner = new Runner(game);
        runner.start();
    });

commander
    .parse(process.argv);

