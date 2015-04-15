React = require 'react'
router = require 'flux-react-router'

routes = require '../../constants/route_names'
t = require '../../utils/gettext'


class ResponseCard extends React.Component

  render: ->
        <div className="app">
            <h1>{ t('ResponseCard') }</h1>
            <p>
                <a href="#{ routes.home }" onClick={ router.deferTo(routes.home) } >
                    { t('Go Home') }
                </a>
            </p>
            <p>
                { @props.response }
            </p>
        </div>

module.exports = ResponseCard
