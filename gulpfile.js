var gulp 		= require( 'gulp' ),
	uglify 		= require( 'gulp-uglify' ),
	concat 		= require( 'gulp-concat' ),
	rename 		= require( 'gulp-rename' ),
	cssmin 		= require( 'gulp-cssmin' ),
	webserver 	= require( 'gulp-webserver' ),
	del 		= require( 'del' );

var jsFiles 	= 'js/aurum-select.js';
var cssFiles 	= 'css/aurum-select/*.css';
var dest 		= 'dist/';

gulp.task( 'scripts', function() {
	gulp.src( jsFiles )
		.pipe( uglify() )
		.pipe( rename({ suffix: '.min' }) )
		.pipe( gulp.dest( dest ) );
});

gulp.task( 'styles', function() {
	gulp.src( cssFiles )
		.pipe( concat( 'aurum-select.css' ) )
		.pipe( gulp.dest( dest ) )
		.pipe( concat( 'aurum-select.min.css' ) )
		.pipe( cssmin() )
		.pipe( gulp.dest( dest ) );
});

gulp.task( 'server', function() {
	gulp.src( './' )
		.pipe( webserver({
			livereload: true,
			open: true
		}) );
});

gulp.task( 'clean', function() {
	return del.sync( dest );
});

gulp.task( 'default', ['clean', 'styles', 'scripts', 'server']);

gulp.task( 'watch', function() {
	gulp.watch( jsFiles, ['scripts'] );
	gulp.watch( cssFiles, ['styles'] );
});