'use strict';

import React from 'react';

import connectToStore from '../utils/connectToStore';
import Feed from '../components/Feed';
import ThemeManager from '../utils/ThemeManager';

@connectToStore
class ProfileFeed extends React.Component {

    static store = 'ProfileFeedStore';

	static propTypes = {
		flux: React.PropTypes.object.isRequired,
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
        this.props.flux.getStore('ProfileFeedStore').getFeed();
    }

    render() {
        return <Feed categories={this.props.categories} />;
    }

}

export default ProfileFeed;

