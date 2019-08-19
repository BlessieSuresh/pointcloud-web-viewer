var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var sass = require('gulp-sass');
var webserver = require('gulp-webserver');

var paths = {
    pages: ['src/*.html'],
    libs: [
        'libs/**/*.*'
    ],
    watch: {
    	typescript: ['./src/*.ts', './src/**/*.ts'],
    	html: ['./src/*.html'],
    	sass: ['./scss/*.scss'],
    	others: ['assets/**/*.*', 'libs/**/*.*']
    },
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

gulp.task('sass', function(done) {
    gulp.src('./scss/main.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(gulp.dest('./dist'))
        .on('end', done);
});

gulp.task('compile', function () {
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

gulp.task('webserver', function() {
  gulp.src('dist')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true
    }));
});

gulp.task('watch', function() {
    gulp.watch(paths.watch.typescript, gulp.series('compile'));
    gulp.watch(paths.watch.html, gulp.series('html'));
    gulp.watch(paths.watch.sass, gulp.series('sass'));
    gulp.watch(paths.watch.others, gulp.series('assets', 'libs'));
});

gulp.task('develop', gulp.series(gulp.parallel('watch', 'webserver')));

gulp.task('default', gulp.series(gulp.parallel('html', 'libs', 'sass', 'assets', 'compile')));