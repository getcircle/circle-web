dashboard_actions = require './dashboard_actions'
routeNames = require '../../constants/route_names'

module.exports = (router) ->
    router.createRoute(routeNames.home, dashboard_actions.home);
    router.createRoute(routeNames.page2, dashboard_actions.other);
