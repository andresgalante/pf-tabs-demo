var gulp = require('gulp'),
  browserSync = require('browser-sync').create(),
  $ = require('gulp-load-plugins')();

gulp.task('js', function () {
  gulp.src([
    'src/pf-tabs.js'
  ])
    .pipe($.plumber())
    .pipe($.babel(
      {presets: ['es2015']}
    ))
    .pipe($.uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('html', function () {
  gulp.src('src/pf-tabs.html')
    .pipe($.rename('pf-tabs.local.html'))
    .pipe(gulp.dest('dist'));
});

gulp.task('css', function () {
  $.rubySass('src/*.scss')
    .pipe($.autoprefixer("last 3 versions", "> 1%"))
    .pipe(gulp.dest('dist'));
});

gulp.task('vulcanize', function () {
  gulp.src('dist/pf-tabs.local.html')
    .pipe($.vulcanize({dest: 'dist', inline: true}))
    .pipe($.rename('pf-tabs.html'))
    .pipe(gulp.dest('dist'));
});

gulp.task('copy', function () {
  gulp.src([
    'node_modules/webcomponents.js/webcomponents.js'
  ])
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['js', 'html', 'css', 'copy', 'vulcanize']);

gulp.task('serve', function(){
  browserSync.init({
    server: {
      baseDir: './'
    }
  });

  gulp.watch('src/*.scss', ['css']);
  gulp.watch('src/*.js', ['js']);
  gulp.watch('src/*.html', ['html', 'vulcanize']);
  gulp.watch("dist/**/*").on('change', browserSync.reload);
});