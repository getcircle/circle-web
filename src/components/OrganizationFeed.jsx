'use strict';

import connectToStores from 'alt/utils/connectToStores';
import React from 'react';

import Feed from './Feed';

@connectToStores
class OrganizationFeed extends React.Component {

    static propTypes = {
        flux: React.PropTypes.object.isRequired,
        // XXX can we get fancier with these and bind them to protobuf objects?
        categories: React.PropTypes.array.isRequired,
    }

    static getStores(props) {
        return [props.flux.getStore('OrganizationFeedStore')];
    }

    static getPropsFromStores(props) {
        return props.flux.getStore('OrganizationFeedStore').getState();
    }

    componentWillMount() {
        this.props.flux.getStore('OrganizationFeedStore').getFeed();
    }

    render() {
        return <Feed categories={this.props.categories} />;
    }

}

export default OrganizationFeed;
