React = require 'react'
router = require 'flux-react-router'

routes = require '../../constants/route_names'
t = require '../../utils/gettext'


class Page2 extends React.Component

  render: ->
        <div className="app">
            { t('Test, yo yo yo') }
            <a href="#{ routes.home }" onClick={ router.deferTo(routes.home) } >
                { t('Go Home') }
            </a>
            <a href="#{ routes.home }" onClick={ router.deferTo(routes.home) } >
                { t('Go Home') }
            </a>
        </div>

module.exports = Page2
