var path = require("path"),
  gulp = require("gulp"),
  browserify = require("browserify"),
  rimraf = require("gulp-rimraf"),  //TODO replace with 'del'
  sass = require("gulp-sass"),
  rename = require("gulp-rename"),
  source = require("vinyl-source-stream");

var join = path.join;
var src = join(__dirname, "public");

var target = join(__dirname, "target"),
  staging = join(target, "staging", "js"),
  assets = join(target, "assets");

gulp.task("stage-js", function(){
  var scriptPath = join(src, 'javascripts');
  return gulp.src("views/**.hbs")
    .pipe(rename({
      dirname: "views"
    }))
    .pipe(gulp.src(join(scriptPath, "**")))
    .pipe(gulp.dest(staging));
});

gulp.task("js", ["stage-js"], function () {
 return browserify(join(staging, 'browser.js'), {debug: true})
    .bundle()
    .pipe(source('browser.js'))
    .pipe(gulp.dest(join(assets, 'js')));
});

gulp.task("css", function () {
  return gulp.src(join(src, 'stylesheets', 'style.scss'))
    .pipe(sass({
      sourceMap: true,
      imagePath: '/images'
    }))
    .pipe(gulp.dest(join(assets, 'css')));

});

gulp.task("fonts", function(){
  return gulp.src(join(src, 'fonts/**'))
    .pipe(gulp.dest(join(assets, 'fonts')));
});

gulp.task("images", function(){
  return gulp.src(join(src, 'images/**'))
    .pipe(gulp.dest(join(assets, 'images')));
});

gulp.task("clean", function(){
  return gulp.src(target)
    .pipe(rimraf());
});

gulp.task("assets", ["js", "css", "fonts", "images"]);

gulp.task("default", ["assets"]);

gulp.task("watch", ["assets"], function(cb){
  gulp.watch(join(src, "**"), ["assets"]);
  cb();
});
