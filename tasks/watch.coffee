gulp = require 'gulp'
batch = require 'gulp-batch'
watch = require 'gulp-watch'

gulp.task 'watch', ->
    watch ['src/**/**.jsx'], ->
        gulp.start('js')
    watch ['src/**/**.js'], ->
        gulp.start('js')
    watch ['src/styles/**/**.scss'], ->
        gulp.start('sass')
