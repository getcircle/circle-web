actions = require './actions'
routeNames = require '../../../constants/route_names'

module.exports = (router) ->
    router.createRoute routeNames.home, actions.home
    router.createRoute routeNames.page2, actions.other
    router.createRoute routeNames.ajaxTest, actions.ajaxTest
