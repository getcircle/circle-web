React = require 'react'
router = require 'flux-react-router'

routes = require '../../constants/route_names'
t = require '../../utils/gettext'


class Page2 extends React.Component

  render: ->
        <div className="app">
            <h1>{ t('Test, yo yo yo') }</h1>
            <p>
                <a href="#{ routes.home }" onClick={ router.deferTo(routes.home) } >
                    { t('Go Home') }
                </a>
            </p>

            <p>
                <a href="#{ routes.ajaxTest }" onClick={ router.deferTo(routes.ajaxTest) } >
                    { t('Go to the Ajax test') }
                </a>
            </p>
        </div>

module.exports = Page2
