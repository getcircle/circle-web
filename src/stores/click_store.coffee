EventEmitter = require('events').EventEmitter

actionTypes = require '../constants/action_types'
dispatcher = require '../dispatcher/dispatcher'

CHANGE_EVENT = 'change'


# some of this could probably live in a base class
class ClickStore extends EventEmitter

    constructor: ->
        @attributes =
            clickCount: 0

        dispatcher.register (action) =>
            @[action.type]()

    increment_click_count: ->
        @attributes.clickCount += 1
        @emitChange(@attributes)

    emitChange: ->
        # I believe it is important that this change doesn't deliver data
        # All communication should happen through the dispatcher
        this.emit CHANGE_EVENT, @attributes

    # We should be smarter about adding and removing listeners
    # it might be wise to use backbone-events-standalone instead
    # EventEmitter. If you leave an event behind garbage collection
    # issues may ensue.
    addChangeListener: (callback) ->
        this.on CHANGE_EVENT, callback

    removeChangeListener: (callback) ->
        this.removeListener CHANGE_EVENT, callback

    toJSON: ->
        clickCount: @attributes.clickCount

module.exports = new ClickStore()
