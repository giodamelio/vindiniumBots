var koa = require("koa");
var koaStatic = require("koa-static");
var koaMount = require("koa-mount");

module.exports = function(commander, log) {
    commander
        .command("web-client")
        .description("Web client")
        .option("-a, --auth <path>", "Set the loacation of the auth file. Defaults to ./auth.json")
        .action(function(env) {
            var server = koa();

            server.use(function* () {
                this.body = "Hello World!";
            });

            server.listen(3141);
            log.info("Server listening on http://localhost:3141");
        });
};

