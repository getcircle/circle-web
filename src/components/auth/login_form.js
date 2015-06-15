import React from 'react';
import t from '../../utils/gettext';

import authActions from '../../actions/auth';
import authStore from '../../stores/auth';
import client from '../../services/client';


class LoginForm extends React.Component {

    constructor() {
        super();
        this.state = {
            isAuthenticated: false
        }
    }

    componentDidMount() {
        authStore.addChangeListener(this.handleAuthStoreChange);
    }

    componentWillUnmount() {
        authStore.removeChangeListener(this.handleAuthStoreChange);
    }

    handleAuthStoreChange() {
        this.setState({
            // XXX why does the initial state not refer to auth store? #parris-question
            isAuthenticated: authStore.isAuthenticated()
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        let email = React.findDOMNode(this.refs.email).value.trim();
        let password = React.findDOMNode(this.refs.password).value.trim();
        authActions.authenticate(email, password);
    }

    render() {
        let authenticationState = this.state.isAuthenticated ? 'authenticated' : 'unauthenticated';
        return (
            <div>
                <h2>{ t('Login Form') }</h2>
                <p>User is {authenticationState}.</p>
                <form className="login-form" onSubmit={this.handleSubmit}>
                    <input type="text" ref="email" placeholder="Work Email Address" />
                    <input type="password" ref="password" placeholder="Password" />
                    <input type="submit" value="#{ t('Login') }" />
                </form>
            </div>
        );
    }

}

export default LoginForm;
