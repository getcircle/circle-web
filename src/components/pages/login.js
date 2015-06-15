import {decorate} from 'react-mixin';
import {Navigation} from 'react-router';
import React from 'react';

import authStore from '../../stores/auth';
import LoginForm from '../forms/auth/login';
import t from '../../utils/gettext';


@decorate(Navigation)
class Login extends React.Component {

    constructor() {
        super();
        this.handleAuthStoreChange = this.handleAuthStoreChange.bind(this);
    }

    componentDidMount() {
        authStore.addChangeListener(this.handleAuthStoreChange);
    }

    componentWillUnmount() {
        authStore.removeChangeListener(this.handleAuthStoreChange);
    }

    handleAuthStoreChange() {
        if (!authStore.isAuthenticated()) {
            // XXX set error state and display error message
            return;
        }
        this.transitionTo('/');
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
