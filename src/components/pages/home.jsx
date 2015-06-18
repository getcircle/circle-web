import React from 'react';

import authenticatedComponent from '../authenticatedComponent';
import t from '../../utils/gettext';


class Home extends React.Component {

    render() {
        return (
            <div>
                <h1>{ `${t('Welcome user:')} ${this.props.user.primary_email}` }</h1>
            </div>
        );
    }

}

export default authenticatedComponent(Home);
