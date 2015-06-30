'use strict';

import React from 'react';

import connectToStore from '../utils/connectToStore';
import ThemeManager from '../utils/ThemeManager';

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
            this.setState({loading: true});
            this.props.flux.getStore('ProfileStore').getProfiles(this.props.nextRequest);
        }
    }

    _renderProfiles() {
        return this.props.profiles.map((profile, index) => {
            return (
                <li key={index}>{profile.full_name}</li>
            );
        });
    }

    render() {
        return (
            <ul>
                {this._renderProfiles()}
            </ul>
        );
    }

}

export default Profiles;
