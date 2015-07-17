'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');

var growlNotifications = require('./growl_notifications');

gulp.task('images', function() {
    var imgSrc = './src/images/**/*',
        imgDst = './dist/images';

    return gulp.src(imgSrc)
        .pipe(plumber({
            errorHandler: growlNotifications('Images Copy Error')
        }))
        .pipe(gulp.dest(imgDst));
});