import {Link} from 'react-router';
import React from 'react';

import t from '../../utils/gettext';
import LoginForm from '../auth/login_form';


class Home extends React.Component {

    render() {
        return (
            <div className="app">
                <h1>{ t('Test, yo yo yo') }</h1>
                <p>
                    <Link to="/page2">Page2</Link>
                </p>
                <LoginForm />
            </div>
        )
    }

}

export default Home;
