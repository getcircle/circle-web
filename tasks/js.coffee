gulp = require 'gulp'
babelify = require 'babelify'
browserify = require 'browserify'
plumber = require 'gulp-plumber'
rename = require 'gulp-rename'
source = require 'vinyl-source-stream'

growlNotifications = require './growl_notifications'

gulp.task 'js', ->
    browserify({
        entries: './src/app.jsx',
        extensions: ['.jsx', '.js']
    })
    .transform(babelify.configure({stage: 1}))
    .bundle()
    .pipe(plumber(
        errorHandler: growlNotifications('JS Compilation Error')
    ))
    .pipe(source('app.js'))
    .pipe(gulp.dest('./dist/'))
