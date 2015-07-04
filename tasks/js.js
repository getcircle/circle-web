'use strict';

var _ = require('lodash');
var babelify = require('babelify');
var browserify = require('browserify');
var browserSync = require('browser-sync');
var buffer = require('vinyl-buffer');
var growlNotifications = require('./growl_notifications');
var gulp = require('gulp');
var gulpNotify = require('gulp-notify');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var reactify = require('reactify');
var watchify = require('watchify');
var util = require('util');

gulp.task('js', function() {
    return browserify({
            entries: './src/main.jsx',
            extensions: ['.jsx', '.js',],
        })
        .transform(babelify.configure({stage: 0}))
        .transform(reactify)
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./dist/'));

});

function handleError(error) {
    var errorMessage = gutil.colors.white(error.toString()) + '\n' +
        error.codeFrame;
    gulpNotify().write(errorMessage);
    this.emit('end');
}

gulp.task('js-watch', function() {
    var opts = _.assign({
            entries: './src/main.js',
            extensions: ['.jsx', '.js',],
            transform: [
                babelify.configure({
                    stage: 0
                }),
                reactify
            ],
            cache: {},
            packageCache: {},
            debug: true,
            fullPaths: true,
        }, watchify.args),
        bundler = browserify(opts);

    bundler
        .bundle()
        .on('error', handleError)
        .pipe(source('./src/main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        })) // loads map from browserify file
        .pipe(sourcemaps.write('.')) // writes .map file
        .pipe(gulp.dest('./dist/'));

    var watcher = watchify(bundler);

    watcher
        .on('update', function() {
            var updateStart = Date.now();
            gutil.log('Compiling JS');
            watcher.bundle()
                .on('error', handleError)
                .pipe(source('./src/main.js'))
                .pipe(buffer())
                .pipe(sourcemaps.init({
                    loadMaps: true
                })) // loads map from browserify file
                .pipe(sourcemaps.write('.')) // writes .map file
                .pipe(gulp.dest('./dist/'))
                .pipe(browserSync.reload({
                    stream: true,
                    once: true
                }));
            gutil.log('Updated JS!', (Date.now() - updateStart) + 'ms');
        });

    return watcher;
});
