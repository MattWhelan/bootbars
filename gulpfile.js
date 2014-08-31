var path = require("path"),
  gulp = require("gulp"),
  browserify = require("gulp-browserify"),
  rimraf = require("gulp-rimraf"),
  sass = require("gulp-sass");

var src = path.join(__dirname, "public");


var target = path.join(__dirname, "target"),
  assets = path.join(target, "assets");

gulp.task("js", function () {
  return gulp.src([path.join(src, 'javascripts', 'browser.js'), 'views/**.jade'])
    .pipe(browserify({
      insertGlobals: true,
      debug: true
    }))
    .pipe(gulp.dest(path.join(assets, 'js')));
});

gulp.task("css", function () {
  return gulp.src(path.join(src, 'stylesheets', 'style.scss'))
    .pipe(sass({
      sourceMap: true,
      imagePath: '/images'
    }))
    .pipe(gulp.dest(path.join(assets, 'css')));

});

gulp.task("fonts", function(){
  return gulp.src(path.join(src, 'fonts/**'))
    .pipe(gulp.dest(path.join(assets, 'fonts')));
});

gulp.task("images", function(){
  return gulp.src(path.join(src, 'images/**'))
    .pipe(gulp.dest(path.join(assets, 'images')));
});

gulp.task("clean", function(){
  return gulp.src(target)
    .pipe(rimraf());
});

gulp.task("assets", ["js", "css", "fonts", "images"]);

gulp.task("default", ["assets"]);

gulp.task("watch", ["assets"], function(cb){
  gulp.watch(path.join(src, "**"), ["assets"]);
  cb();
});
