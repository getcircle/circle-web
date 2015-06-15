import {Link} from 'react-router';
import React from 'react';

import t from '../../utils/gettext'


class Page2 extends React.Component {

    render() {
        return (
            <div className="app">
                <h1>{ t('Test, yo yo yo') }</h1>
                <p>
                    <Link to="/">{ t('Go Home') }</Link>
                </p>
            </div>
        );
    }
}

export default Page2;
