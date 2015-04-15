dashboardActions = require './dashboard_actions'
routeNames = require '../../constants/route_names'

module.exports = (router) ->
    router.createRoute(routeNames.home, dashboardActions.home);
    router.createRoute(routeNames.page2, dashboardActions.other);
    router.createRoute(routeNames.ajaxTest, dashboardActions.ajaxTest);
