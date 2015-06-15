Link = require('react-router').Link
React = require 'react'

t = require '../../utils/gettext'


class Page2 extends React.Component

  render: ->
        <div className="app">
            <h1>{ t('Test, yo yo yo') }</h1>
            <p>
                <Link to="/">{ t('Go Home') }</Link>
            </p>
        </div>

module.exports = Page2
