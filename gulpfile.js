var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserify = require('gulp-browserify'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    imagemin = require('gulp-imagemin'),
    pngcrush = require('imagemin-pngcrush'),
    concat = require('gulp-concat');

var env,
    jsDependenciesSources,
    jsSources,
    htmlSources,
    cssDependenciesSources,
    cssSources,
    outputDir;

env = process.env.NODE_ENV || 'development';
outputDir = 'build/';

jsDependenciesSources = [
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'node_modules/angular/angular.min.js'
];
jsSources = 'src/js/*.js';
cssDependenciesSources = [
    'node_modules/bootstrap/dist/css/bootstrap.min.css'
];
cssSources = 'src/css/*.css';
imgSources = 'src/img/**/*.*';
htmlSources = '*.html';

gulp.task('jsDependencies', function() {
    gulp.src(jsDependenciesSources)
        .pipe(gulp.dest(outputDir + 'jsDependencies'))
        .pipe(connect.reload());
});

gulp.task('js', function() {
    gulp.src(jsSources)
        .pipe(concat('bundle.js'))
        .pipe(browserify())
        .pipe(gulpif(env === 'production', uglify()))
        .pipe(gulp.dest(outputDir))
        .pipe(connect.reload());
});

gulp.task('html', function() {
    gulp.src(htmlSources)
    .pipe(gulpif(env === 'production', minifyHTML()))
    .pipe(gulp.dest(outputDir))
    .pipe(connect.reload());
});

gulp.task('cssDependencies', function() {
    gulp.src(cssDependenciesSources)
    .pipe(gulp.dest(outputDir + 'cssDependencies'))
    .pipe(connect.reload());
});

gulp.task('css', function() {
    gulp.src(cssSources)
    .pipe(gulp.dest(outputDir + 'css'))
    .pipe(connect.reload());
});

gulp.task('images', function() {
    gulp.src(imgSources) 
        .pipe(gulpif(env === 'production', imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngcrush()]
    })))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir + 'images')))
    .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch(jsSources, ['js']);
    gulp.watch(htmlSources, ['html']);
    gulp.watch(cssSources, ['css']);
    gulp.watch(imgSources, ['images']);
});

gulp.task('connect', function() {
    connect.server({
        root: outputDir,
        livereload: true
    });
});

gulp.task('default',
    ['jsDependencies', 'js', 'cssDependencies', 'css',
     'images', 'html', 'connect', 'watch']
);