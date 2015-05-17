EventEmitter = require('events').EventEmitter

actionTypes = require '../constants/action_types'
BaseStore = require './base_store'
dispatcher = require '../dispatcher/dispatcher'


class ClickStore extends BaseStore

    constructor: ->
        super('ClickStore')
        @attributes =
            clickCount: 0

    increment_click_count: (action) ->
        @attributes.clickCount += 1
        @emitChange(@attributes)

    toJSON: ->
        clickCount: @attributes.clickCount

module.exports = new ClickStore()
