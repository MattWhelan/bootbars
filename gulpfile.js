var path = require("path"),
  gulp = require("gulp"),
  browserify = require("browserify"),
  del = require("del"),
  sass = require("gulp-sass"),
  rename = require("gulp-rename"),
  source = require("vinyl-source-stream"),
  reduce = require("stream-reduce"),
  fs = require("fs");

var join = path.join;
var src = join(__dirname, "public"),
  views = join(__dirname, "views");

var target = join(__dirname, "target"),
  staging = join(target, "staging", "js"),
  assets = join(target, "assets");

gulp.task("register-partials", function(){
  return gulp.src("views/partials/**", {
    read: false
  })
    .pipe(reduce(function(memo, data){
      var filePath = data.path;
      var filename = filePath.substr(data.base.length);
      if(filename.length){
        var partialName = path.basename(filename, ".hbs");
        var reg = 'hbs.registerPartial("' + partialName + '", require("./views/partials/' + filename + '"));\n';
        return memo + reg;
      } else {
        return memo;
      }
    }, 'hbs = require("hbsfy/runtime");\n'))
    .pipe(source("allPartials.js"))
    .pipe(gulp.dest(staging));
});

gulp.task("stage-templates", function(){
  var scriptPath = join(src, 'javascripts');
  return gulp.src(join(views, "**"))
    .pipe(gulp.dest(join(staging, "views")));
});

gulp.task("stage-js", ["register-partials"], function(){
  var scriptPath = join(src, 'javascripts');
  return gulp.src(join(scriptPath, "**"))
    .pipe(gulp.dest(staging));
});

gulp.task("js", ["stage-js", "stage-templates"], function () {
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

gulp.task("clean", function(cb){
  del([target], cb);
});

gulp.task("assets", ["js", "css", "fonts", "images"]);

gulp.task("default", ["assets"]);

gulp.task("watch", ["assets"], function(cb){
  gulp.watch([join(src, "**"), "views/**"], ["assets"]);
  cb();
});
