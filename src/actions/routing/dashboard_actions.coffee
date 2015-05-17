React = require 'react'
request = require 'superagent'

Home = require '../../components/home/home'
Page2 = require '../../components/home/page2'
ResponseCard = require '../../components/response/card'
renderUtils = require '../../utils/render'


module.exports =
    home: ->
        React.unmountComponentAtNode(renderUtils.getBody())
        React.render(
            <Home />,
            renderUtils.getBody()
        )
    other: ->
        React.unmountComponentAtNode(renderUtils.getBody())
        React.render(
            <Page2 />,
            renderUtils.getBody()
        )
    ajaxTest: ->
        request
            .get('http://ip.jsontest.com/')
            .end (err, response) ->
                if not err
                    React.unmountComponentAtNode(renderUtils.getBody())
                    React.render(
                        <ResponseCard response={ response.body } />,
                        renderUtils.getBody()
                    )
                else
                    # should probably redirect here before alerting
                    alert 'Ajax resulted in an error'
