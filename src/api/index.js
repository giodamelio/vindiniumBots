var path = require("path");

var koa = require("koa");
var staticFiles = require("koa-static");
var mount = require("koa-mount");
var router = require("koa-joi-router");

var server = koa();

// Serve static app
server.use(staticFiles(path.resolve(__dirname, "../app")));

// Serve the api
var api = router();
api.route({
    method: "GET",
    path: "/",
    handler: function*() {
        this.body = "Hello API!!!";
    }
});
server.use(mount("/api", api.middleware()));

server.listen(3141);
console.log("Server listening on http://localhost:3141");

