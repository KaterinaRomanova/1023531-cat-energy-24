import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import rename from 'gulp-rename';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import htmlmin from 'gulp-htmlmin';
import del from "del";
import svgo from 'gulp-svgmin';

//Clean

export const clean = () => {
  return del('build');
}

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// Html

export const html = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('build'));
}

// Scripts

export const scripts = () => {
  return gulp.src('source/js/*.js')
  .pipe(terser())
  .pipe(gulp.dest('build/js'));
}

// Image

export const optimizeImages = () => {
  return gulp.src('source/img/**/*.png')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'));
}

export const copyImages = () => {
  return gulp.src('source/img/**/*.png')
  .pipe(gulp.dest('build/img'));
}

export const createWebp = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
  .pipe(squoosh({
    webp: {}
  }))
  .pipe(gulp.dest('build/img'));
}

export const svg = () => {
  return gulp.src(['source/img/**/*.svg', '!source/img/sprite.svg'])
  .pipe(svgo())
  .pipe(gulp.dest('build/img'));
}

//Copy

export const copy = (done) => {
  return gulp.src([
    'source/img/sprite.svg',
    'source/fonts/*.{woff, woff2}',
    'source/*.ico',
    'source/*.webmanifest'
  ],{
    base:'source'
  })
    .pipe(gulp.dest('build'))
  done();
}


// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

//Reload

const reload = (done) => {
  browser.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/*.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(html, reload));
}


export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    html,
    styles,
    scripts,
    createWebp,
    svg,
  )
);

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    html,
    styles,
    scripts,
    createWebp,
    svg,
  ),
  gulp.series(
    server,
    watcher
  )

);
