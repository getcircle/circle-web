React = require 'react'
router = require 'flux-react-router'

routes = require '../../constants/route_names'
t = require '../../utils/gettext'

LoginForm = require '../auth/login_form'


class Home extends React.Component

    render: ->
        # sometimes {} doesn't work
        # you can use "#{}" inside double quotes
        # {} is jsx, #{} is coffeescript
        <div className="app">
            <h1>{ t('Test, yo yo yo') }</h1>

            <p>
                <a href="#{ routes.page2 }" onClick={router.deferTo(routes.page2)}>
                    { t('Go to Page 2') }
                </a>
            </p>
            <LoginForm />
        </div>

module.exports = Home
