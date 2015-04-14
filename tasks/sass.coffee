gulp = require 'gulp'
plumber = require 'gulp-plumber'
sass = require 'gulp-sass'

growlNotifications = require './growl_notifications'

gulp.task 'sass', ->
    gulp.src('./src/styles/app.scss')
        .pipe(plumber(
            errorHandler: growlNotifications('CSS Compilation Error')
        ))
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(gulp.dest('./dist/'))
