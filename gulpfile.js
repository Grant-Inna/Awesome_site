var gulp = require( 'gulp' ),
    smartgrid = require('smart-grid'),
    groupMedia = require('gulp-group-css-media-queries'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    rename = require("gulp-rename"),
    jsmin = require('gulp-jsmin'),
    sass = require("gulp-sass"),
    jade = require( 'gulp-jade' ),
    concat = require('gulp-concat');


/* It's principal settings in smart grid project */
var GridSettings = {
    outputStyle: 'sass', /* less || scss || sass || styl */
    columns: 12, /* number of grid columns */
    offset: '30px', /* gutter width px || % */
    mobileFirst: false, /* mobileFirst ? 'min-width' : 'max-width' */
    container: {
        maxWidth: '1200px', /* max-width în very large screen */
        fields: '30px' /* side fields */
    },
    breakPoints: {
        lg: {
            width: '1200px', /* -> @media (max-width: 1200px) */
        },
        md: {
            width: '960px'
        },
        sm: {
            width: '780px',
            fields: '15px' /* set fields only if you want to change container.fields */
        },
        xs: {
            width: '560px'
        }
        /*
         We can create any quantity of break points.

         some_name: {
         width: 'Npx',
         fields: 'N(px|%|rem)',
         offset: 'N(px|%|rem)'
         }
         */
    }
};

/*gulp.task( 'smart-grid', function() {
    smartgrid('dev/sass/', GridSettings);
});*/


// Tasks ===============================================================================================================

// CSS _____________________________________________________________________
gulp.task('CSS', function() {
    return gulp.src('dev/scss/main.scss')
        .pipe(groupMedia())
        .pipe(sass().on('error', sass.logError)) // Turn scss file into css
        .pipe(autoprefixer({browsers: ['last 5 versions', '> 3%']}))
        .pipe(rename("style.css"))
        .pipe(gulp.dest('app/css/'));
});
gulp.task('minCss', function() {
    return gulp.src('app/css/style.css')
        .pipe(cleanCSS())
        .pipe(rename("style.min.css"))
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
    gulp.watch( "./app/jade/**/*.jade" , ['jade_pages']);
});


// Tasks arrays ========================================================================================================

var tasksCSS = ['CSS', 'minCSS', 'watch_min', 'watch_CSS'];

var tasksJade = ['jade_pages', 'jade_static', 'jade_template', 'watch_jade'];

// Main tasks

gulp.task('default', tasksCSS);
gulp.task('jade', tasksJade);
