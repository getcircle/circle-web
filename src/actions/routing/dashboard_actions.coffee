React = require 'react'

Home = require '../../components/home/home'
Page2 = require '../../components/home/page2'
renderUtils = require '../../utils/render'


module.exports =
    home: ->
        React.unmountComponentAtNode(renderUtils.getBody());
        React.render(
            <Home />,
            renderUtils.getBody()
        );
    other: ->
        React.unmountComponentAtNode(renderUtils.getBody());
        React.render(
            <Page2 />,
            renderUtils.getBody()
        );
