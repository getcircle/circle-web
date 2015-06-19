'use strict';

import * as mui from 'material-ui';
import React from 'react';

import requireAuth from './requireAuth';
import t from '../utils/gettext';

const {Avatar} = mui;


class Home extends React.Component {

    render() {
        return (
            <div>
                <h1>{ `${t('Welcome user:')} ${this.props.user.primary_email}` }</h1>
                <h1>{ `${t('First name:')} ${this.props.profile.first_name}` }</h1>
                <Avatar src={ `${this.props.profile.image_url}` } />
            </div>
        );
    }

}

export default requireAuth(Home);
