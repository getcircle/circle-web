import {decorate} from 'react-mixin';
import {Navigation} from 'react-router';
import React from 'react';

import AuthStore from '../../stores/auth';
import LoginForm from '../forms/auth/login';
import t from '../../utils/gettext';


@decorate(Navigation)
class Login extends React.Component {

    constructor() {
        super();
        this.handleAuthStoreChange = this.handleAuthStoreChange.bind(this);
    }

    componentDidMount() {
        AuthStore.addChangeListener(this.handleAuthStoreChange);
    }

    componentWillUnmount() {
        AuthStore.removeChangeListener(this.handleAuthStoreChange);
    }

    handleAuthStoreChange() {
        if (!AuthStore.isAuthenticated()) {
            // XXX set error state and display error message
            return;
        }
        this.transitionTo(this.props.query.nextPath || '/');
    }

    render() {
        return (
            <div>
                <h1>{ t('Login') }</h1>
                <LoginForm />
            </div>
        )
    }
}

export default Login;
