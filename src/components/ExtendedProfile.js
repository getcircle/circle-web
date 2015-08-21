import { decorate } from 'react-mixin';
import { Navigation } from 'react-router';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import {
    routeToProfile,
    routeToLocation,
    routeToTeam,
} from '../utils/routes';

import DetailContent from './DetailContent';
import ExtendedProfileContactInfo from './ExtendedProfileContactInfo';
import ExtendedProfileHeader from './ExtendedProfileHeader';
import ExtendedProfileManages from './ExtendedProfileManages';
import ExtendedProfileStatus from './ExtendedProfileStatus';
import ExtendedProfileTeam from './ExtendedProfileTeam';
import StyleableComponent from './StyleableComponent';

const { ContactMethodV1 } = services.profile.containers;

const styles = {
    section: {
        marginTop: 20,
    },
};

@decorate(Navigation)
class ExtendedProfile extends StyleableComponent {

    static propTypes = {
        extendedProfile: PropTypes.object.isRequired,
        organization: PropTypes.instanceOf(services.organization.containers.OrganizationV1).isRequired,
    }

    static contextTypes = {
        router: PropTypes.object.isRequired,
    }

    _renderStatus(status) {
        return <ExtendedProfileStatus style={this.mergeAndPrefix(styles.section)} status={status}/>;
    }

    _renderContactInfo(contactMethods=[], locations=[]) {
        return (
            <ExtendedProfileContactInfo
                style={this.mergeAndPrefix(styles.section)}
                contactMethods={contactMethods}
                locations={locations}
                onClickLocation={routeToLocation.bind(this)}
            />
        );
    }

    _renderTeam(manager, peers, team) {
        if (team) {
            return (
                <ExtendedProfileTeam
                    style={this.mergeAndPrefix(styles.section)}
                    manager={manager}
                    peers={peers}
                    team={team}
                    onClickManager={routeToProfile.bind(this, manager)}
                    onClickTeam={routeToTeam.bind(this, team)}
                    onClickPeer={routeToProfile.bind(this)}
                />
            );
        }
    }

    _renderManages(team, directReports) {
        if (team) {
            return (
                <ExtendedProfileManages
                    style={this.mergeAndPrefix(styles.section)}
                    team={team}
                    directReports={directReports}
                    onClickTeam={routeToTeam.bind(this, team)}
                    onClickDirectReport={routeToProfile.bind(this)}
                />
            );
        }
    }

    _getContactMethods() {
        const { profile } = this.props.extendedProfile;
        let contactMethods = [new ContactMethodV1({
            label: "Email",
            value: profile.email,
            contact_method_type: ContactMethodV1.ContactMethodTypeV1.EMAIL,
        })];
        return contactMethods.concat(profile.contact_methods);
    }

    render() {
        const {
            direct_reports,
            locations,
            manager,
            manages_team,
            peers,
            profile,
            team,
        } = this.props.extendedProfile;
        const { organization } = this.props;
        return (
            <div>
                <ExtendedProfileHeader
                    location={locations[0]}
                    organization={organization}
                    profile={profile}
                    team={team}
                />
                <DetailContent>
                    {this._renderStatus(profile.status)}
                    {this._renderContactInfo(this._getContactMethods(), locations)}
                    {this._renderTeam(manager, peers, team)}
                    {this._renderManages(manages_team, direct_reports)}
                </DetailContent>
            </div>
        );
    }

}

export default ExtendedProfile;
