var gulp = require("gulp");
var source = require("vinyl-source-stream");
var browserify = require("browserify");
var reactify = require("reactify");
var to5ify = require("6to5ify");
var to5 = require("gulp-6to5");
var nodemon = require("gulp-nodemon");
var del = require("del");

// The paths to our resources
var paths = {
    src: {
        api: "src/api/**/*.js",
        app: {
            jsEntry: "./src/app/js/main.js",
            js: "src/app/js/**/*.js",
            html: "src/app/**/*.html"
        },
        bots: "src/bots/**/*.js",
        game: "src/game/**/*.js",
        manager: "src/manager/**/*.js",
        models: "src/models/**/*.js"
    },
    dest: {
        api: "dist/api/",
        app: "dist/app/",
        bots: "dist/bots/",
        game: "dist/game/",
        manager: "dist/manager/",
        models: "dist/models/"
    }
};

// Compile api server with 6to5
gulp.task("api", function() {
    gulp.src(paths.src.api)
        .pipe(to5({
            blacklist: ["regenerator"]
        }))
        .pipe(gulp.dest(paths.dest.api));
});

// Run our api server
gulp.task("api:server", function() {
    nodemon({
        script: "dist/api/index.js",
        watch: "dist/api/",
        execMap: {
            "js": "iojs"
        }
    });
});

gulp.task("app", function() {
    // Build our app with browserify, 6to5 and react
    browserify(paths.src.app.jsEntry)
        .transform(reactify)
        .transform(to5ify)
        .bundle()
        .pipe(source("bundle.js"))
        .pipe(gulp.dest(paths.dest.app));

    // Move html file
    gulp.src(paths.src.app.html)
        .pipe(gulp.dest(paths.dest.app));
});

// Compile bots with 6to5
gulp.task("bots", function() {
    gulp.src(paths.src.bots)
        .pipe(to5({
            blacklist: ["regenerator"]
        }))
        .pipe(gulp.dest(paths.dest.bots));
});

// Compile game with 6to5
gulp.task("game", function() {
    gulp.src(paths.src.game)
        .pipe(to5({
            blacklist: ["regenerator"]
        }))
        .pipe(gulp.dest(paths.dest.game));
});

// Compile manager with 6to5
gulp.task("manager", function() {
    gulp.src(paths.src.manager)
        .pipe(to5({
            blacklist: ["regenerator"]
        }))
        .pipe(gulp.dest(paths.dest.manager));
});

// Compile models with 6to5
gulp.task("models", function() {
    gulp.src(paths.src.models)
        .pipe(to5({
            blacklist: ["regenerator"]
        }))
        .pipe(gulp.dest(paths.dest.models));
});

// Clean out dist
gulp.task("clean", function() {
    del.sync("dist/");
});

// Build all of the modules
gulp.task("all", ["api", "app", "bots", "game", "manager", "models"]);

// Build and watch all the modules
gulp.task("watch", ["all"], function() {
    gulp.watch(paths.src.api, ["api"]);
    gulp.watch([paths.src.app.js, paths.src.app.html], ["app"]);
    gulp.watch(paths.src.bots, ["bots"]);
    gulp.watch(paths.src.game, ["game"]);
    gulp.watch(paths.src.manager, ["manager"]);
    gulp.watch(paths.src.models, ["models"]);
});

// Run full dev enviroment
gulp.task("dev", ["watch", "api:server"]);

