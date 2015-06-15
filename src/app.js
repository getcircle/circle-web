require("babel/register");

import fastclick from 'fastclick';
import React from 'react';
import Router from 'react-router';
import {DefaultRoute, Route, RouteHandler} from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Home from './components/home/home'
import Page2 from './components/home/page2'
import * as renderUtils from './utils/render'

// export for http://fb.me/react-devtools
window.React = React

// Touch related
injectTapEventPlugin();
React.initializeTouchEvents(true)
fastclick(document.body)

class App extends React.Component {

    render() {
        return (
            <RouteHandler />
        );
    }

}

const routes = (
    <Route handler={App}>
        <DefaultRoute handler={Home} />
        <Route path="page2" handler={Page2} />
    </Route>
)

Router.run(routes, Router.HistoryLocation, function(Root) {
    React.render(<Root />, renderUtils.getBody());
});
