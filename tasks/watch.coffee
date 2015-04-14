gulp = require 'gulp'
batch = require 'gulp-batch'
watch = require 'gulp-watch'

gulp.task 'watch', ->
    watch ['src/**/**.cjsx'], ->
        gulp.start('js')
    watch ['src/**/**.coffee'], ->
        gulp.start('js')
    watch ['src/**/**.js'], ->
        gulp.start('js')
    watch ['src/styles/**/**.scss'], ->
        gulp.start('sass')
