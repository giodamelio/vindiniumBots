var gulp = require("gulp");
var to5 = require("gulp-6to5");

gulp.task("default", function () {
    return gulp.src("src/index.js")
        .pipe(to5())
        .pipe(gulp.dest("dist"));
});

