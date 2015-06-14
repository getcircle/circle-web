ActionTypes = require '../constants/action_types'
BaseStore = require './base'

_currentUser = null
_currentToken = null


class AuthStore extends BaseStore

    authenticationCompleted: (action) ->
        debugger
        _currentUser = action.result.user
        _currentToken = action.result.token
        @emitChange()

    getCurrentUser: ->
        _currentUser

    getCurrentToken: ->
        _currentToken

    isAuthenticated: ->
        _currentUser?

module.exports = new AuthStore()
