var gulp = require( 'gulp' ),
    groupMedia = require('gulp-group-css-media-queries'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    rename = require("gulp-rename"),
    imagemin = require('gulp-imagemin'),
    sass = require("gulp-sass"),
    jade = require( 'gulp-jade' ),
    jsmin = require('gulp-jsmin'),
    concat = require('gulp-concat');



// Tasks ===============================================================================================================

// Images __________________________________________________________________

var imdArr = ['dev/img/*.{png,jpg,jpeg,svg}', 'dev/img/**/*.{png,jpg,jpeg,svg}'];

gulp.task('compress', function() {
    return gulp.src( imdArr )
        .pipe(imagemin())
        .pipe(gulp.dest('app/img/'));
});


// JavaScript ______________________________________________________________

gulp.task('minJS', function(){
    return gulp.src( 'dev/js/*.js' )
        .pipe(jsmin())
        .pipe(gulp.dest('app/js/'));
});

gulp.task('watch_js', function() {
    gulp.watch('dev/js/*.js', ['minJS'])
});


// CSS _____________________________________________________________________

gulp.task('CSS', function() {
    return gulp.src('dev/scss/main.scss')
        //.pipe(groupMedia())
        .pipe(sass()) // Turn scss file into css
        .pipe(autoprefixer({browsers: ['last 5 versions', '> 3%']}))
        .pipe(rename("style.css"))
        .pipe(gulp.dest('app/css/'));
});
gulp.task('minCSS', function() {
    return gulp.src('app/css/style.css')
        .pipe(cleanCSS())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest('app/css/'));
});

gulp.task('watch_CSS', function() {
    gulp.watch('dev/scss/*.scss', ['CSS'])
});
gulp.task('watch_min', function() {
    gulp.watch('app/css/style.css', ['minCSS'])
});


// JADE _____________________________________________________________________

gulp.task( 'jade_pages', function() {
    return gulp.src('dev/jade/pages/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('app/'))
});
/*gulp.task( 'jade_static', function() {
    return gulp.src('dev/jade/static/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('dev/jade/dest/static'))
});
gulp.task( 'jade_template', function() {
    return gulp.src('dev/jade/template/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('dev/jade/dest/template'))
});*/


gulp.task( 'watch_jade', function() {
    gulp.watch( "dev/jade/**/*.jade" , ['jade_pages']);
});


// Tasks arrays ========================================================================================================


var tasksCSS = ['compress', 'CSS', 'minCSS', 'watch_min', 'watch_CSS'];

var tasksJade = ['jade_pages', 'watch_jade'];

var tasksJS = [ 'minJS', 'watch_js'];

var tasksAll = ['CSS', 'minCSS', 'watch_min', 'watch_CSS', 'jade_pages', 'watch_jade'];

// Main tasks

gulp.task('default', tasksAll);
gulp.task('css', tasksCSS);
gulp.task('jade', tasksJade);
gulp.task('js', tasksJS);
