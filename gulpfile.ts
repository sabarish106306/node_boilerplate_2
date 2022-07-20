const gulp = require("gulp");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const del = require("del");

// Task which would transpile typescript to javascript
gulp.task("build", function () {
  return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("dist"));
});

// Task which would delete the old dist directory if present
gulp.task("clean", function () {
  return del(["./dist"]);
});

// The default task which runs at start of the gulpfile.js
gulp.task("default", gulp.series("clean","build"), () => {
  console.log("Done");
});
