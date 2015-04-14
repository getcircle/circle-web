exec = require('child_process').exec
sys = require('sys')

gulp = require 'gulp'
uglify = require 'gulp-uglify'
shell = require 'gulp-shell'

gulp.task 'deploy-assets', shell.task ['divshot push']

gulp.task 'minifyJS', ['js'], ->
    gulp.src('dist/app.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'))

gulp.task 'deploy', ['default', 'minifyJS'], ->
    process = exec 'divshot push', (error, stdout, stderr) ->
        sys.print stdout
        sys.print stderr
        if error is not null
            console.log error
