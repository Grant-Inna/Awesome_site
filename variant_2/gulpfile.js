var gulp = require('gulp'),
    groupMedia = require('gulp-group-css-media-queries'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    rename = require("gulp-rename"),
    imagemin = require('gulp-imagemin'),
    less = require("gulp-less"),
    jade = require( 'gulp-jade' ),
    sourcemaps = require('gulp-sourcemaps'),
    smartGrid = require('smart-grid'),
    browserSync = require('browser-sync').create();


// PATH

var dev = 'src',
    build = 'app',
    dir = {
        style: '/css/',
        html: '/',
        images: '/img/',
        fonts: '/fonts/',
        js: '/js/'
    };

var devImages = dev + dir.images + '*.{png,jpg,jpeg,svg}',
    devImgDir = dev + dir.images + 'goods/*.{png,jpg,jpeg,svg}',
    devFonts = dev + dir.fonts + '**/*.{ttf,woff,woff2,eot,svg}',
    devStyle = dev + dir.style + '*.less',
    devHTML = dev + dir.html + '*.jade',
    devHTMLDir = dev + dir.html + '**/*.jade',
    devJS = dev + dir.js + '*.js';

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: [ dev, build ]
        }
    });
});

// TASKS

// CopyFonts

gulp.task( 'copyFonts', function() {
    return gulp.src( devFonts )
        .pipe(gulp.dest( build + dir.fonts ))
});

gulp.task( 'copyJS', function() {
    return gulp.src( devJS )
        .pipe(gulp.dest( build + dir.js ))
});

// Images

gulp.task('imageMIN', function() {
    return gulp.src([ devImages, devImgDir ])
        .pipe(imagemin())
        .pipe(gulp.dest( build + dir.images + 'goods/' ));
});


gulp.task('watch_imageMIN', ['browser-sync'], function() {
    gulp.watch( devImages, ['imageMIN', 'iconsMIN']);
    gulp.watch( devImages ).on('change', browserSync.reload);
});


// CSS

gulp.task('CSS', function() {
    return gulp.src( dev + dir.style + 'style.less' )
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer({ browsers: ['last 5 versions', '> 1%'], cascade: false }))
        .pipe(groupMedia())
        .pipe(cleanCSS())
        .pipe(rename({ suffix: ".min" }))
        .pipe(sourcemaps.write( '../map' ))
        .pipe(gulp.dest( build + dir.style ));
});


gulp.task('watch_CSS', ['browser-sync'], function() {
    gulp.watch( devStyle , ['CSS']);
    gulp.watch( devStyle ).on('change', browserSync.reload); // К тому же есть возможность отслеживать сразу несколько директорий
});


// JADE

gulp.task( 'jade', function() {
    return gulp.src([ devHTML ])
        .pipe(jade())
        .pipe(gulp.dest( build + dir.html ))
});

gulp.task( 'watch_jade', ['browser-sync'], function() {
    gulp.watch([ devHTML, devHTMLDir] , ['jade']);
    gulp.watch( [ devHTML, devHTMLDir] ).on('change', browserSync.reload);

});



 // Smart Grid

gulp.task('smartGrid', function() {
    var options = {
        offset: "2px",
        container: {
            maxWidth: "1300px",
            fields: "4px"
        },
        breakPoints: {
            lg: {
                width: '1100px'
            },
            md: {
                width: '960px'
            },
            sm: {
                width: '780px'
            },
            xs: {
                width: '560px'
            },
            xxs: {
                width: '450px'
            },
            tiny: {
                width: '350px'
            }
        }
    };
    smartGrid( './src/css/', options);
});

// Tasks arrays


var tasksImage = ['imageMIN'];

var tasksCSS = ['CSS', 'watch_CSS'];

var tasksJade = ['jade', 'watch_jade'];

var tasksAll = [ 'copyFonts', 'copyJS', 'imageMIN', 'CSS', 'watch_CSS', 'jade', 'watch_jade'];


// Main tasks

gulp.task('default', tasksAll);
gulp.task('tasksImage', tasksImage);
gulp.task('tasksCSS', tasksCSS);
gulp.task('tasksJade', tasksJade);


