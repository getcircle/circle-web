'use strict';

var exec = require('child_process').exec;
var sys = require('sys');

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var shell = require('gulp-shell');

gulp.task('deploy-assets', shell.task(['divshot push']));

gulp.task('minifyJS', ['js'], function () {
    return gulp.src('dist/app.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('deploy', ['default', 'minifyJS'], function () {
    return exec('divshot push', function (error, stdout, stderr) {
        sys.print(stdout);
        sys.print(stderr);
        if (error !== null) {
        	/*eslint-disable no-console*/
            console.log(error);
            /*eslint-enable no-console*/
        }
    });
});
