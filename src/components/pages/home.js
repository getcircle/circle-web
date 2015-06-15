import {Link} from 'react-router';
import React from 'react';

import AuthenticatedComponent from '../authenticated_component';
import authStore from '../../stores/auth';
import LoginForm from '../forms/auth/login';
import t from '../../utils/gettext';


class Home extends AuthenticatedComponent {

    constructor() {
        super();
        this.state = {
            user: authStore.currentUser
        };
    }

    render() {
        return (
            <div>
                <h1>{ `${t('Welcome user:')} ${this.state.user.primary_email}` }</h1>
            </div>
        )
    }

}

export default Home;
