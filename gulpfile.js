/*****************************************************************************************
DEPENDENCIES
*****************************************************************************************/

var gulp = require('gulp');
var rename = require("gulp-rename");
var sass = require('gulp-ruby-sass');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

/*****************************************************************************************
HTML / MAIN
*****************************************************************************************/

gulp.task('html', function(){
	return gulp.src('src/main/index.html')
	.pipe(gulp.dest('public'));
});

/*****************************************************************************************
SASS, CSS / MAIN
*****************************************************************************************/

gulp.task('sass', function () {
	return sass('src/main/scss/app.scss')
    .on('error', sass.logError)
    .pipe(gulp.dest('public/css'));
});

gulp.task('minifyCss', ['sass'], function (){
	return gulp.src('public/css/app.css')
	.pipe(sourcemaps.init())
	.pipe(cssnano())
    .pipe(sourcemaps.write('.'))
	.pipe(rename('app.min.css'))
	.pipe(gulp.dest('public/css'));
});

/*****************************************************************************************
JAVASCRIPT / MAIN
*****************************************************************************************/

gulp.task('concatJs', function(){
	return gulp.src(
		[
			'src/main/js/_eventemitter.js',
			'src/main/js/_main.js',
			'src/main/js/_nav.js',
			'src/main/js/_get-posts.js',
			'src/main/js/_texteditor.js'
		]
	)
	.pipe(concat('app.js'))
    .pipe(gulp.dest('public/js'));
});

gulp.task('minifyJs', ['concatJs'], function (){
	return gulp.src('public/js/app.js')
	.pipe(uglify())
	.pipe(rename('app.min.js'))
    .pipe(gulp.dest('public/js'));
});

/*****************************************************************************************
JAVASCRIPT / PHP
*****************************************************************************************/

gulp.task('php', function(){
	return gulp.src('src/main/php/**/*.php')
	.pipe(gulp.dest('public/php'));
});

/*****************************************************************************************
JAVASCRIPT / ADMIN MODULE
*****************************************************************************************/

gulp.task('concatJsAdmin', function(){
	return gulp.src(
		[
			'src/admin/js/module_main.js'
		]
	)
	.pipe(concat('app.js'))
    .pipe(gulp.dest('public/admin/js'));
});

gulp.task('minifyJsAdmin', ['concatJsAdmin'], function (){
	return gulp.src('public/admin/js/app.js')
	.pipe(uglify())
	.pipe(rename('app.min.js'))
    .pipe(gulp.dest('public/admin/js'));
});

/*****************************************************************************************
JAVASCRIPT / PHP
*****************************************************************************************/

gulp.task('phpAdmin', function(){
	return gulp.src('src/admin/php/**/*.php')
	.pipe(gulp.dest('public/admin/php'));
});

/*****************************************************************************************
WATCH
*****************************************************************************************/

gulp.task('watch', function (){
	gulp.watch('src/main/index.html', ['html']);
	gulp.watch('src/main/scss/**/*.scss', ['minifyCss']);
	gulp.watch('src/main/js/**/*.js', ['minifyJs']);
	gulp.watch('src/main/php/**/*.php', ['php']);
	gulp.watch('src/admin/js/**/*.js', ['minifyJsAdmin']);
	gulp.watch('src/admin/php/**/*.php', ['phpAdmin']);
});

/*****************************************************************************************
DEFAULT
*****************************************************************************************/

gulp.task('default',
	[
		'html',
		'minifyCss',
		'minifyJs',
		'php',
		'minifyJsAdmin',
		'phpAdmin',
		'watch'
	]
);