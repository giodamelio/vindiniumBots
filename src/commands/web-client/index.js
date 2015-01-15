module.exports = function(commander, log) {
    commander
        .command("web-client")
        .description("Web client")
        .option("-a, --auth <path>", "Set the loacation of the auth file. Defaults to ./auth.json")
        .action(function(env) {
            log.info("Hello World!");
        });
};

