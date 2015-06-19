'use strict';

import connectToStores from 'alt/utils/connectToStores';
import React from 'react';

import Feed from './Feed';

@connectToStores
class ProfileFeed extends React.Component {

	static propTypes = {
		flux: React.PropTypes.object.isRequired,
        categories: React.PropTypes.array.isRequired,
	}

    static getStores(props) {
        return [props.flux.getStore('ProfileFeedStore')];
    }

    static getPropsFromStores(props) {
        return props.flux.getStore('ProfileFeedStore').getState();
    }

    componentWillMount() {
        this.props.flux.getStore('ProfileFeedStore').getFeed();
    }

    render() {
        return <Feed categories={this.props.categories} />;
    }

}

export default ProfileFeed;
