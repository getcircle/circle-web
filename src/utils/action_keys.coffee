_ = require 'lodash'

module.exports = (obj) ->
    ret = {}
    for own key of obj
        ret[key] = _.camelCase key
    ret
