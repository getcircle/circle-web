'use strict';

var gulp = require('gulp');
var watch = require('gulp-watch');

gulp.task('watch', function () {
    watch(['src/**/**.jsx'], function () {
        gulp.start('js');
    });

    watch(['src/**/**.js'], function () {
        gulp.start('js');
    });

    watch(['src/styles/**/**.scss'], function () {
        gulp.start('sass');
    });

});
