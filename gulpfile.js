const gulp = require('gulp');
const watch = require('gulp-watch');
const changed = require('gulp-changed');
const rigger = require('gulp-rigger');
const sass = require('gulp-sass')(require('node-sass'));
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const jsmin = require('gulp-jsmin');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');

gulp.task('default', [
    'build-html',
    'build-styles',
    'build-images',
    'build-scripts',
]);

gulp.task('watch', () => {
    gulp.watch('./src/html/**/*.html', ['build-html']);
    gulp.watch('./src/styles/**/*.scss', ['build-styles']);
    gulp.watch('./src/images/*', ['build-images']);
    gulp.watch('./src/scripts/**/*.js', ['build-scripts']);
});

gulp.task('build-html', () => {
    gulp.src('./src/html/*.html')
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(rigger())
        .pipe(gulp.dest(''))
});

gulp.task('build-styles', () => {
    gulp.src('./src/styles/*.scss')
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 10 versions'],
        }))
        .pipe(cleanCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(''))
});

gulp.task('build-scripts', () => {
    gulp.src('./src/scripts/*.js')
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['latest']
        }))
        .pipe(jsmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(''))
});

gulp.task('build-images', () => {
    gulp.src('./src/images/**/*')
        .pipe(changed('public/images/**/*'))
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(imagemin())
        .pipe(gulp.dest('images'))
});
