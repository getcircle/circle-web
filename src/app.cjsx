fastclick = require 'fastclick'
React = require 'react'
Router = require 'react-router'

Home = require './components/home/home'
Page2 = require './components/home/page2'
renderUtils = require './utils/render'

DefaultRoute = Router.DefaultRoute
Route = Router.Route
RouteHandler = Router.RouteHandler

# export for http://fb.me/react-devtools
window.React = React

# Touch related
React.initializeTouchEvents(true)
fastclick(document.body)

class App extends React.Component
    render: ->
        <RouteHandler />

routes = (
    <Route handler={App}>
        <DefaultRoute handler={Home} />
        <Route path="page2" handler={Page2} />
    </Route>
)

Router.run routes, Router.HistoryLocation, (Root) ->
    React.render <Root />, renderUtils.getBody()
