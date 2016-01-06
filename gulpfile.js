/*****************************************************************************************
DEPENDENCIES
*****************************************************************************************/

var gulp = require('gulp');
var connect = require('gulp-connect');
var rename = require("gulp-rename");
var sass = require('gulp-ruby-sass');
var minifyCss = require('gulp-minify-css');
var sourceMaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');
var htmlreplace = require('gulp-html-replace');

/*****************************************************************************************
DEVELOPER VIEW, LIVE RELOAD
*****************************************************************************************/

gulp.task('connectDev', function() {
	connect.server(
		{
			port: 8000,
			livereload: true
		}
	);
});

/*****************************************************************************************
HTML
*****************************************************************************************/

gulp.task('html', function(){
	gulp.src('*.html')
	.pipe(connect.reload());
})

/*****************************************************************************************
SASS, CSS
*****************************************************************************************/

gulp.task('compileSass', function () {
	return sass('scss/app.scss')
	.pipe(sourceMaps.init())
    .on('error', sass.logError)
    .pipe(sourceMaps.write('./'))
    .pipe(gulp.dest('css'))
    .pipe(connect.reload());
});

gulp.task('minifyCss', ['compileSass'], function (){
	return gulp.src('css/app.css')
	.pipe(minifyCss({compatibility: 'ie8'}))
	.pipe(rename('app.min.css'))
	.pipe(gulp.dest('css'));
});

/*****************************************************************************************
JAVASCRIPT
*****************************************************************************************/

gulp.task('concatJs', function(){
	return gulp.src(
		[
			'js/_eventemitter.js',
			'js/_main.js',
			'js/_nav.js',
			'js/_get-posts.js',
			'js/_texteditor.js'
		]
	)
	.pipe(concat('app.js'))
    .pipe(gulp.dest('js'))
    .pipe(connect.reload());
});

gulp.task('concatJsCustomModuleAdmin', function(){
	return gulp.src(
		[
			'custom_module_admin/js/_module_app.js',
			'custom_module_admin/js/_factory_auth.js',
			'custom_module_admin/js/_controller_auth.js',
			'custom_module_admin/js/_factory_posts.js',
			'custom_module_admin/js/_factory_texteditor.js',
			'custom_module_admin/js/_controller_posts_addnew.js',
			'custom_module_admin/js/_controller_posts_detailed.js',
			'custom_module_admin/js/_controller_posts_list.js'
		]
	)
	.pipe(concat('app.js'))
    .pipe(gulp.dest('custom_module_admin/js'))
    .pipe(connect.reload());
});

gulp.task('minifyJs', ['concatJs'], function (){
	return gulp.src('js/app.js')
	.pipe(uglify())
	.pipe(rename('app.min.js'))
    .pipe(gulp.dest('js'));
});

/*****************************************************************************************
CLEAN
*****************************************************************************************/

gulp.task('cleanDev', function(){
	return del(
		[
			'.sass-cache',
			'css/app.css.map',
			'css/app.min.css',
			'js/app.min.js',
			'./distribution/**'
		]
	)
});

/*****************************************************************************************
WATCH
*****************************************************************************************/

gulp.task('watch', function (){
	gulp.watch('*.html', ['html']);
	gulp.watch('scss/**/*.scss', ['compileSass']);
	gulp.watch('js/**/*.js', ['concatJs']);
	gulp.watch('custom_module_admin/js/**/*.js', ['concatJsCustomModuleAdmin']);
});

/*****************************************************************************************
BUILD DISTRIBUTION
*****************************************************************************************/

gulp.task('build', ['minifyCss', 'minifyJs'], function(){
	gulp.src(
		[
			'css/app.min.css',
			'js/app.min.js',
			'img/**',
			'index.html'
		], 
		{
			base: './'
		}
	)
	.pipe(htmlreplace({
        'css': 'css/app.min.css',
        'js': 'js/app.min.js'
    }))
	.pipe(gulp.dest('distribution'));
});

/*****************************************************************************************
DEFAULT
*****************************************************************************************/

gulp.task('default',
	[
		'connectDev',
		'compileSass',
		'concatJs',
		'concatJsCustomModuleAdmin',
		'watch'
	]
);