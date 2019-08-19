var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var clean = require('gulp-clean');

var paths = {
    pages: ['./html/*.html', './html/**/*.html'],
    libs: [
        'libs/**/*.*'
    ],
    watch: {
    	typescript: ['./src/*.ts', './src/**/*.ts'],
    	html: ['./html/*.html', './html/**/*.html'],
    	sass: ['./scss/*.scss', './scss/**/*.scss'],
    	others: ['assets/**/*.*', 'libs/**/*.*']
    },
    assets: [
        'assets/**/*.*'
    ]
};

gulp.task('html', function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});

gulp.task('libs', function () {
    return gulp.src(paths.libs)
        .pipe(gulp.dest('./dist/libs'))
        .pipe(connect.reload());
});

gulp.task('assets', function () {
    return gulp.src(paths.assets)
        .pipe(gulp.dest('./dist/assets'))
        .pipe(connect.reload());
});

gulp.task('sass', function(done) {
    gulp.src('./scss/main.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(gulp.dest('./dist'))
        .on('end', done)
        .pipe(connect.reload());
});

gulp.task('compile', function () {
    return browserify({
        basedir: '.',
        debug: false,
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
	    //.pipe(uglify()) //=> enable for release!
	    .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});

gulp.task('clean', function () {
    return gulp.src('dist/*', {read: false})
    	.pipe(clean());
});

gulp.task('connect', function() {
	connect.server({
    root: 'dist',
    livereload: true
  });
});

gulp.task('watch', function() {
    gulp.watch(paths.watch.typescript, gulp.series('compile'));
    gulp.watch(paths.watch.html, gulp.series('html'));
    gulp.watch(paths.watch.sass, gulp.series('sass'));
    gulp.watch(paths.watch.others, gulp.series('assets', 'libs'));
});

gulp.task('default', gulp.series('clean', gulp.parallel('html', 'libs', 'sass', 'assets', 'compile')));

gulp.task('develop', gulp.series('default', gulp.parallel('watch', 'connect')));