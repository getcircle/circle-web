'use strict';

import mui from 'material-ui';
import React from 'react';

import connectToStore from '../utils/connectToStore';
import CenterLoadingIndicator from '../components/CenterLoadingIndicator';
import ProfilesGrid from '../components/ProfilesGrid';
import ThemeManager from '../utils/ThemeManager';

const { CircularProgress } = mui;

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
        muiTheme: React.PropTypes.object,
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    componentWillMount() {
        this.props.flux.getStore('ProfileStore').getProfiles();
    }

    componentDidMount() {
        window.addEventListener('scroll', this._handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this._handleScroll);
    }

    _handleScroll = this._handleScroll.bind(this);
    _handleScroll(event) {
        if (!this.props.loading && this.props.nextRequest !== null) {
            this.props.flux.getStore('ProfileStore').getProfiles(this.props.nextRequest);
        }
    }

    render() {
        if (this.props.profiles && this.props.profiles.length === 0) {
            return <CenterLoadingIndicator />;
        } else {
            return <ProfilesGrid profiles={this.props.profiles} />;
        }
    }

}

export default Profiles;
