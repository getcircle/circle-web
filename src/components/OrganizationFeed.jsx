'use strict';

import React from 'react';

import connectToStore from '../utils/connectToStore';
import Feed from './Feed';

import ThemeManager from '../utils/ThemeManager';

@connectToStore
class OrganizationFeed extends React.Component {

    static store = 'OrganizationFeedStore';

	static propTypes = {
        flux: React.PropTypes.object.isRequired,
        // XXX can we get fancier with these and bind them to protobuf objects?
        categories: React.PropTypes.array.isRequired,
    }

    static childContextTypes = {
        muiTheme: React.PropTypes.object,
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    componentWillMount() {
        this.props.flux.getStore('OrganizationFeedStore').getFeed();
    }

    render() {
        return <Feed categories={this.props.categories} />;
    }

}

export default OrganizationFeed;
