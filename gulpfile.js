var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();

gulp.task('minify', function () {
  gulp.src('./static/js/*.js')
      .pipe(gulp.dest('./dist/js'))
      .pipe(plugins.rename({suffix:'.min'}))
      .pipe(plugins.uglify())
      .pipe(gulp.dest('./dist/js'))
      .pipe(plugins.livereload());
});

gulp.task('sass', function() {
    gulp.src('./static/scss/*.scss')
        .pipe(plugins.autoprefixer('last 2 version'))
        .pipe(plugins.sass())
        .pipe(gulp.dest('./dist/css'))
        .pipe(plugins.rename({suffix:'.min'}))
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest('./dist/css'))
        .pipe(plugins.livereload());
});

gulp.task('mincss', function () {
  gulp.src('./static/css/*.css')
      .pipe(plugins.rename({suffix:'.min'}))
      .pipe(plugins.minifyCss())
      .pipe(gulp.dest('./dist/css'))
      .pipe(plugins.livereload());
});

gulp.task('default', function(){
    gulp.run('minify', 'sass', 'mincss');

    gulp.watch('./static/css/*.css', ['mincss']);

    gulp.watch('./static/scss/*.scss', ['sass']);
 
    gulp.watch('./static/js/*.js', ['minify']);

});