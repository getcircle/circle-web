EventEmitter = require('events').EventEmitter

dispatcher = require '../dispatcher/dispatcher'

CHANGE_EVENT = 'change'


class BaseStore extends EventEmitter

    constructor: ->
        @dispatchToken = dispatcher.register (action) =>
            # Use the object as a hash map to search for a corresponding
            # handler for the action.type
            #
            # XXX does attempting to call this without checking the value
            # cause a failure or is that some coffeescript magic?
            @[action.type](action)

    emitChange: ->
        this.emit CHANGE_EVENT

    # We should be smarter about adding and removing listeners
    # it might be wise to use backbone-events-standalone instead
    # EventEmitter. If you leave an event behind garbage collection
    # issues may ensue.
    addChangeListener: (callback) ->
        this.on CHANGE_EVENT, callback

    removeChangeListener: (callback) ->
        this.removeListener CHANGE_EVENT, callback

module.exports = BaseStore
