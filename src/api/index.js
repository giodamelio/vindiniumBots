var path = require("path");
var fs = require("fs");

var koa = require("koa");
var staticFiles = require("koa-static");
var mount = require("koa-mount");
var router = require("koa-joi-router");
var thunkify = require("thunkify");

var server = koa();

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

// Serve static app
var appPath = path.resolve(__dirname, "../app");

// Serve the assets
server.use(mount("/static", staticFiles(appPath)));

// Serve the index on anything but /api/* and static /static/*
var readFile = thunkify(fs.readFile);
var indexPath = path.join(appPath, "index.html");
server.use(function*() {
    this.type = "text/html";
    this.body = yield readFile(indexPath);
});

server.listen(3141);
console.log("Server listening on http://localhost:3141");

