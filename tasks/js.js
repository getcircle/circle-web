'use strict';

var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var plumber = require('gulp-plumber');
var source = require('vinyl-source-stream');

var growlNotifications = require('./growl_notifications');

gulp.task('js', function () {
    return browserify({
        entries: './src/main.jsx',
        extensions: ['.jsx', '.js']
    })
        .transform(babelify.configure({stage: 0}))
        .bundle()
        .pipe(plumber({
            errorHandler: growlNotifications('JS Compilation Error'),
        }))
        .pipe(source('app.js'))
        .pipe(gulp.dest('./dist/'));
});
