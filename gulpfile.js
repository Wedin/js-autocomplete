const gulp        = require('gulp');
const browserSync = require('browser-sync').create();
const sass        = require('gulp-sass');
const prettier    = require('gulp-prettier');


// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'scripts'], function() {

  browserSync.init({
    server: "./public"
  });

  gulp.watch("public/*.scss", ['sass']).on('change', browserSync.reload);
  gulp.watch("public/*.js", ['scripts']).on('change', browserSync.reload);
  gulp.watch("public/*.html").on('change', browserSync.reload);
});

gulp.task('scripts', () => {
  gulp.src('public/*.js')
  .pipe(prettier({useFlowParser: false, printWidth: 125}))
  .pipe(gulp.dest('public/'));
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', () => {
  return gulp.src("public/*.scss")
  .pipe(sass())
  .pipe(gulp.dest("public/dist/"))
  .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
