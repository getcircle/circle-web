'use strict';

var gulp = require('gulp');
var watch = require('gulp-watch');

gulp.task('watch', function () {
    gulp.start('js-watch');

    watch(['src/styles/**/**.scss'], function () {
        gulp.start('sass');
    });

    // If an image is modified, run our images task
    watch('./src/images/**/*', ['images']);
});
