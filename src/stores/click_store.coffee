EventEmitter = require('events').EventEmitter

BaseStore = require './base_store'


class ClickStore extends BaseStore

    constructor: ->
        super
        @attributes =
            clickCount: 0

    increment_click_count: (action) ->
        @attributes.clickCount += 1
        @emitChange(@attributes)

    toJSON: ->
        clickCount: @attributes.clickCount

module.exports = new ClickStore()
