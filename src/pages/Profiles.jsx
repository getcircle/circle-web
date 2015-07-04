'use strict';

import _ from 'lodash';
import domReady from 'domready';
import React from 'react';

import connectToStore from '../utils/connectToStore';
import ProfileTile from '../components/ProfileTile';
import ThemeManager from '../utils/ThemeManager';

// Selected arbitrarily via experimentation
const infiniteScrollBoundaryHeight = 300;

// XXX look into addding the PureRenderMixin
@connectToStore
class Profiles extends React.Component {

    static store = 'ProfileStore';

    static propTypes = {
        flux: React.PropTypes.object.isRequired,
        profiles: React.PropTypes.array.isRequired,
        nextRequest: React.PropTypes.object,
        loading: React.PropTypes.bool.isRequired,
    }

    static childContextTypes = {
        muiTheme: React.PropTypes.object.isRequired,
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    componentWillMount() {
        // If we refresh we don't want a bunch of AJAX requests to fire due to scroll position
        domReady(() => {
            window.scrollTo(0, 0);
        });

        this._loadMore = this._loadMore.bind(this);
        this.setState({
            elements: []
        });
        this._loadMore();
    }

    componentDidMount() {
        window.addEventListener('scroll', this._loadMore);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this._loadMore);
    }

    _loadMore(event) {
        const bottomYScrollPosition = window.innerHeight + document.body.scrollTop;
        const bodyHeight = document.body.offsetHeight;

        if (this.props.loading) {
            return
        }

        if (bottomYScrollPosition + infiniteScrollBoundaryHeight < bodyHeight) {
            return;
        }

        this.props.flux.getStore('ProfileStore').getProfiles(this.props.nextRequest).then(() => {
            this.setState({
                elements: this.state.elements.concat(
                    this._renderProfiles(
                        _.slice(this.props.profiles, this.state.elements.length))
                ),
            });
        });
    }

    _renderProfiles(profiles) {
        return profiles.map((profile, index) => {
            return (
                <div key={profile.id} className="col-xs-12 col-sm-6 col-md-4">
                    <ProfileTile profile={profile} />
                </div>
            );
        });
    }

    render() {
        return (
            <div className="row">
                {this.state.elements}
            </div>
        );
    }

}

export default Profiles;
