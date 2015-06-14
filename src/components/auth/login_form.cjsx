React = require 'react'
t = require '../../utils/gettext'

# XXX are actions coupled to stores? should we have actions/auth_store?
authActions = require '../../actions/auth'
authStore = require '../../stores/auth'
client = require '../../services/client'


class LoginForm extends React.Component

    constructor: ->
        @state =
            isAuthenticated: false

    componentDidMount: ->
        authStore.addChangeListener(this.handleAuthStoreChange)

    componentWillUnmount: ->
        authStore.removeChangeListener(this.handleAuthStoreChange)

    handleAuthStoreChange: =>
        debugger
        @setState
            # XXX why does the initial state not refer to auth store? #parris-question
            isAuthenticated: authStore.isAuthenticated()

    handleSubmit: (event) =>
        event.preventDefault()
        email = React.findDOMNode(this.refs.email).value.trim()
        password = React.findDOMNode(this.refs.password).value.trim()
        # XXX shouldn't allow submitting if its empty
        authActions.authenticate email, password

    render: ->
        authenticationState = if this.state.isAuthenticated then 'authenticated' else 'unauthenticated'
        <div>
            <h2>{ t('Login Form') }</h2>
            <p>User is {authenticationState}.</p>
            <form className="login-form" onSubmit={this.handleSubmit}>
                <input type="text" ref="email" placeholder="Work Email Address" />
                <input type="password" ref="password" placeholder="Password" />
                <input type="submit" value="#{ t('Login') }" />
            </form>
        </div>

module.exports = LoginForm
