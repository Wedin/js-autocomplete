const gulp = require('gulp');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const prettier = require('gulp-prettier');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const util = require('gulp-util');
const pump = require('pump');

const config = {
  scssSrc: 'src/*.scss',
  jsSrc: [ 'src/*.js' ],
  dest: 'dist/',
  exampleStaticSrc: [ 'example/*.html', 'example/cities.json' ],
  exampleJs: 'example/*.js',
  exampleScss: 'example/*.scss',
  production: !!util.env.production,
};

// Static Server + watching scss/html files
gulp.task('serve', [ 'sass', 'scripts', 'copy-static', 'example' ], function() {
  browserSync.init({ server: './dist' });

  gulp.watch(config.scssSrc, [ 'sass' ]).on('change', browserSync.reload);
  gulp.watch(config.jsSrc, [ 'scripts' ]).on('change', browserSync.reload);
  gulp.watch(config.htmlSrc).on('change', browserSync.reload);
});

gulp.task('scripts', cb => {
  console.log(config.production);
  pump(
    [
      gulp.src(config.jsSrc),
      !config.production ? prettier({ useFlowParser: false, printWidth: 125 }) : util.noop(),
      config.production ? babel({ presets: [ 'es2015' ] }) : util.noop(),
      config.production ? uglify() : util.noop(),
      gulp.dest(config.dest),
    ],
    cb,
  );
});

gulp.task('example-scripts', cb => {
  pump(
    [
      gulp.src(config.exampleJs),
      !config.production ? prettier({ useFlowParser: false, printWidth: 125 }) : util.noop(),
      config.production ? babel({ presets: [ 'es2015' ] }) : util.noop(),
      config.production ? uglify() : util.noop(),
      gulp.dest(config.dest),
    ],
    cb,
  );
});

gulp.task('copy-static', () => {
  console.log(config.exampleStaticSrc);
  gulp.src(config.exampleStaticSrc).pipe(gulp.dest(config.dest));
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', () => {
  return gulp
    .src(config.scssSrc)
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(config.production ? autoprefixer({ browsers: [ 'last 2 versions' ], cascade: false }) : util.noop())
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.stream());
});

gulp.task('example-sass', () => {
  return gulp
    .src(config.exampleScss)
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(config.production ? autoprefixer({ browsers: [ 'last 2 versions' ], cascade: false }) : util.noop())
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.stream());
});

gulp.task('build', [ 'sass', 'example-sass', 'scripts', 'example-scripts', 'copy-static' ]);
gulp.task('example', [ 'example-sass', 'example-scripts', 'copy-static' ]);
gulp.task('default', [ 'serve' ]);
