'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');

var growlNotifications = require('./growl_notifications');

gulp.task('sass', function () {
    return gulp.src('./src/styles/app.scss')
        .pipe(plumber({
            errorHandler: growlNotifications('CSS Compilation Error')
        }))
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(gulp.dest('./dist/'));
});
