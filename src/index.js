var commander = require("commander");

var version = require("../package.json").version;

commander
    .version(version);

commander
    .command("server")
    .description("Main game server")
    .action(function(env) {
        console.log(env);
    });

commander
    .parse(process.argv);

