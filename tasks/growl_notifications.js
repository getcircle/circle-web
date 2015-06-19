'use strict';

var gutil = require('gulp-util');
var notifier = require('node-notifier');

/*eslint-disable no-undef*/
module.exports = function (taskName) {
    return function (error) {
        gutil.beep();

        notifier.notify({
            title: taskName,
            message: error.message
        });

        gutil.log(
            gutil.colors.red(taskName),
            gutil.colors.red(error.toString())
        );

        this.emit('end');
    };

};
