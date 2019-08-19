var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var sass = require('gulp-sass');

var paths = {
    pages: ['src/*.html'],
    libs: [
        'libs/**/*.*'
    ],
    watch: [
        './src/*.ts',
        './src/**/*.ts',
        './src/*.html',
        './scss/*.scss'
    ],
    assets: [
        'assets/**/*.*'
    ]
};

gulp.task('html', function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest('dist'));
});

gulp.task('libs', function () {
    return gulp.src(paths.libs)
        .pipe(gulp.dest('./dist/libs'));
});

gulp.task('assets', function () {
    return gulp.src(paths.assets)
        .pipe(gulp.dest('./dist/assets'));
});

gulp.task('js', function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/main.ts'],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
       	.transform('babelify', {
        	presets: ['env'],
        	extensions: ['.ts']
    	})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
	    .pipe(sourcemaps.init({loadMaps: true}))
	    .pipe(uglify())
	    .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    gulp.watch(paths.watch, gulp.series('default'));
});

gulp.task('sass', function(done) {
    gulp.src('./scss/main.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(gulp.dest('./dist'))
        .on('end', done);
});

gulp.task('default', gulp.series(gulp.parallel('html', 'libs', 'sass', 'assets', 'js')));