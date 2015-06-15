Link = require('react-router').Link
React = require 'react'

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
                <Link to="/page2">Page2</Link>
            </p>
            <LoginForm />
        </div>

module.exports = Home
