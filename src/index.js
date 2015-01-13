var commander = require("commander");
var bunyan = require("bunyan");

var version = require("../package.json").version;

// Create cli
commander
    .version(version);

// Create logger
var log = bunyan.createLogger({
    name: "vindiniumBots"
});

// Create server command
require("./commands/server")(commander, log);

// Parse args and run command
commander
    .parse(process.argv);

