gulp = require 'gulp'
babelify = require 'babelify'
browserify = require 'browserify'
plumber = require 'gulp-plumber'
rename = require 'gulp-rename'

growlNotifications = require './growl_notifications'

gulp.task 'js', ->
    browserify({
        entries: './src/app.js',
        extensions: ['.jsx', '.js']
    })
    .transform(babelify)
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./dist/'))
    #.pipe(plumber(
        #errorHandler: growlNotifications('JS Compilation Error')
    #))
