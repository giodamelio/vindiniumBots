var path = require("path");

var koa = require("koa");
var staticFiles = require("koa-static");
var mount = require("koa-mount");
var router = require("koa-joi-router");

module.exports = function(commander, log) {
    commander
        .command("web-client")
        .description("Web client")
        .option("-a, --auth <path>", "Set the loacation of the auth file. Defaults to ./auth.json")
        .action(function(env) {
            var server = koa();

            // Serve static app
            server.use(staticFiles(path.join(__dirname, "static")));

            // Serve the api
            var api = router();
            api.route({
                method: "GET",
                path: "/",
                handler: function*() {
                    this.body = "Hello API!";
                }
            });
            server.use(mount("/api", api.middleware()));

            server.listen(3141);
            log.info("Server listening on http://localhost:3141");
        });
};

