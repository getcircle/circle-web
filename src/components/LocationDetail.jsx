'use strict';

import { decorate } from 'react-mixin';
import mui from 'material-ui';
import { Navigation } from 'react-router';
import React from 'react';

import t from '../utils/gettext';

import EmbeddedGoogleMap from './EmbeddedGoogleMap';

const {
    List,
    ListDivider,
    ListItem,
} = mui;

@decorate(Navigation)
class LocationDetail extends React.Component {

    static propTypes = {
        location: React.PropTypes.object.isRequired,
        profiles: React.PropTypes.array.isRequired,
        teams: React.PropTypes.array.isRequired,
        profilesNextRequest: React.PropTypes.object,
        teamsNextRequest: React.PropTypes.object,
    }

    styles = {
        image: {
            maxWidth: 300,
            maxHeight: 300,
        },
        sectionTitle: {
            color: '#666',
            fontSize: '16px',
            letterSpacing: '1px',
            paddingLeft: 0,
            paddingTop: 10,
            textTransform: 'uppercase',
            fontWeight: 'normal',
        },
        location: {
            paddingTop: 20,
        },
    }

    _renderLocationImage() {
        const { location } = this.props;
        if (location.image_url) {
            return <img className="extended_profile__image" src={location.image_url} />;
        }
    }

    _renderProfiles() {
        const { location } = this.props;
        return (
            <List subheader={t('People')} subheaderStyle={this.styles.sectionTitle}>
                <ListItem onTouchTap={this._routeToProfiles}>
                    {`${location.profile_count} people`}
                </ListItem>
            </List>
        );
    }

    _renderTeams() {
        const { teamsNextRequest } = this.props;
        const { count } = teamsNextRequest.actions[0].control.paginator;
        return (
            <List subheader={t('Teams')} subheaderStyle={this.styles.sectionTitle}>
                <ListItem onTouchTap={this._routeToTeams}>
                    {`${count} teams`}
                </ListItem>
            </List>
        );
    }

    render() {
        const {
            location,
            profiles,
        } = this.props;

        return (
            <div className="row item_detail">
                <div className="col-sm-3">
                    {this._renderLocationImage()}
                </div>
                <div className="col-sm-9 item_detail__details">
                    <div className="row start-xs">
                        <h1>{location.name}</h1>
                    </div>
                    <div className="row start-xs">
                        <EmbeddedGoogleMap style={this.styles.location} location={location} height="450" width="100%" />
                    </div>
                    {this._renderProfiles()}
                    <ListDivider />
                    {this._renderTeams()}
                </div>
            </div>
        );
    }
}

export default LocationDetail;
