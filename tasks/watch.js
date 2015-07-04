'use strict';

var gulp = require('gulp');
var watch = require('gulp-watch');

gulp.task('watch', function () {
    gulp.start('js-watch');

    watch(['src/styles/**/**.scss'], function () {
        gulp.start('sass');
    });

});
