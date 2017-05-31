const gulp        = require('gulp');
const browserSync = require('browser-sync').create();
const sass        = require('gulp-sass');
const prettier    = require('gulp-prettier');
const autoprefixer = require('gulp-autoprefixer');
const util = require('gulp-util');

const config = {
  production: !!util.env.production, // --production
};

// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'scripts', 'copy-static'], function() {

  browserSync.init({
    server: "./dist"
  });

  gulp.watch("src/*.scss", ['sass']).on('change', browserSync.reload);
  gulp.watch("src/*.js", ['scripts']).on('change', browserSync.reload);
  gulp.watch("public/*.html").on('change', browserSync.reload);
});

gulp.task('scripts', () => {
  gulp.src(['src/*.js', 'public/*.js'])
  .pipe(prettier({useFlowParser: false, printWidth: 125}))
  .pipe(gulp.dest('dist/'));
});

gulp.task('copy-static', () => {
  gulp.src('public/*.html')
  .pipe(gulp.dest('dist/'));
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', () => {
  return gulp.src("*.scss")
  .pipe(sass())
  .pipe(config.production ? autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }) : util.noop())
  .pipe(gulp.dest("dist/"))
  .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
