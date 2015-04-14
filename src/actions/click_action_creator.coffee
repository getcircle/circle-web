actionTypes = require '../constants/action_types'
dispatcher = require '../dispatcher/dispatcher'

module.exports =
    click: ->
        dispatcher.dispatch
            type: actionTypes.clickStore.INCREMENT_CLICK_COUNT

