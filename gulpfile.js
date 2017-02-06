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

var vendorJs	= [
	'bower_components/angular/angular.js',
	'bower_components/jquery/dist/jquery.js',
	'bower_components/bootstrap/dist/js/bootstrap.js',
	'bower_components/lodash/dist/lodash.compat.js'
]
var vendorCss	= 'bower_components/acResetCSS/acReset.css';

gulp.task( 'vendors', function() {
	gulp.src( vendorJs )
		.pipe( concat( 'vendors.min.js' ) )
		.pipe( uglify() )
		.pipe( gulp.dest( 'vendors/' ) );
	gulp.src( vendorCss )
		.pipe( concat( 'vendors.min.css' ) )
		.pipe( cssmin() )
		.pipe( gulp.dest( 'vendors/' ) );
});

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
	return del.sync( [dest, 'vendors/'] );
});

gulp.task( 'default', ['clean', 'vendors', 'styles', 'scripts', 'server']);

gulp.task( 'watch', function() {
	gulp.watch( jsFiles, ['scripts'] );
	gulp.watch( cssFiles, ['styles'] );
});