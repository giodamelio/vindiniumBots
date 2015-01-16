// Setup 6to5
require("6to5/register")({
    blacklist: [
        "generators"
    ]
});

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

// Create web client
require("./commands/web-client")(commander, log);

// Parse args and run command
commander
    .parse(process.argv);

