gulp = require 'gulp'
browserify = require 'gulp-browserify'
plumber = require 'gulp-plumber'
rename = require 'gulp-rename'

growlNotifications = require './growl_notifications'

gulp.task 'js', ->
  gulp.src('./src/app.cjsx', { read: false })
    .pipe(plumber(
        errorHandler: growlNotifications('JS Compilation Error')
    ))
    .pipe(browserify({
        transform: ['coffee-reactify'],
        extensions: ['.cjsx', '.coffee'],
    }))
    .pipe(rename('app.js'))
    .pipe(gulp.dest('./dist/'))
