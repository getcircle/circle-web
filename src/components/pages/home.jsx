import {Link} from 'react-router';
import React from 'react';

import AuthenticatedComponent from '../authenticated_component';
import t from '../../utils/gettext';


class Home extends React.Component {

    render() {
        return (
            <div>
                <h1>{ `${t('Welcome user:')} ${this.props.user.primary_email}` }</h1>
            </div>
        )
    }

}

export default AuthenticatedComponent(Home);
