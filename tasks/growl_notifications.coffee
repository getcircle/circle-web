gulp  = require 'gulp'
gutil = require 'gulp-util'
notifier = require 'node-notifier'

module.exports = (taskName) ->
    'use strict'

    return (error) ->
        gutil.beep()

        notifier.notify
            title: taskName
            message: error.message

        gutil.log(
            gutil.colors.red(taskName),
            gutil.colors.red(error.toString())
        )

        this.emit 'end'
