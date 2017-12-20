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
        images: '/img/'
    };

var devImages = dev + dir.images + '*.{png,jpg,jpeg,svg}',
    devStyle = dev + dir.style + '*.less',
    devHTML = dev + dir.html + '*.jade';

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: [ dev, build ]
        }
    });
});

// TASKS

// Images

gulp.task('imageMIN', function() {
    return gulp.src( devImages )
        .pipe(imagemin())
        .pipe(gulp.dest( build + dir.images ));
});

gulp.task('watch_imageMIN', ['browser-sync'], function() {
    gulp.watch( devImages, ['imageMIN']);
    gulp.watch( devImages ).on('change', browserSync.reload); // Вызываемый таким образом browserSync работает почему то стабильнее
});


// CSS

gulp.task('CSS', function() {
    return gulp.src( dev + dir.style + 'style.less' )
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer( {browsers: ['last 5 versions', '> 1%'], cascade: false} ))
        .pipe(groupMedia()) // У меня идёт всегда разделение на отдельные файлы в scss, но пусть будет)
        .pipe(cleanCSS())
        .pipe(rename( { suffix: ".min" } ))
        .pipe(sourcemaps.write( '../map' )) // Жаль, но не получилось запихать sourcemap куда–нибудь подальше, он переставал работать от этого почему–то
        .pipe(gulp.dest( build + dir.style ));
});


gulp.task('watch_CSS', ['browser-sync'], function() {
    gulp.watch( devStyle , ['CSS']);
    gulp.watch( devStyle ).on('change', browserSync.reload); // К тому же есть возможность отслеживать сразу несколько директорий
});


// JADE

gulp.task( 'jade', function() {
    return gulp.src( dev + dir.html + '*.jade' )
        .pipe(jade())
        .pipe(gulp.dest( build + dir.html ))
});

gulp.task( 'watch_jade', ['browser-sync'], function() {
    gulp.watch( devHTML , ['jade']);
    gulp.watch( devHTML ).on('change', browserSync.reload);

});



 // Smart Grid

gulp.task('smartGrid', function() {
    var options = {
        offset: "8px",
        container: {
            maxWidth: "1100px",
            fields: "8px"
        },
        breakPoints: {
            lg: {
                width: '1100px', /* -> @media (max-width: 1100px) */
                offset: '6px',
                fields: '3px'
            },
            md: {
                width: '960px'
            },
            sm: {
                width: '780px',
                offset: '4px',
                fields: '2px'
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

var tasksAll = ['imageMIN', 'CSS', 'watch_CSS', 'jade', 'watch_jade'];


// Main tasks

gulp.task('default', tasksAll);
gulp.task('tasksImage', tasksImage);
gulp.task('tasksCSS', tasksCSS);
gulp.task('tasksJade', tasksJade);

