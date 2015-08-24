import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import {
    routeToProfile,
    routeToLocation,
    routeToTeam,
} from '../utils/routes';

import DetailContent from './DetailContent';
import ProfileDetailContactInfo from './ProfileDetailContactInfo';
import ProfileDetailHeader from './ProfileDetailHeader';
import ProfileDetailManages from './ProfileDetailManages';
import ProfileDetailStatus from './ProfileDetailStatus';
import ProfileDetailTeam from './ProfileDetailTeam';
import StyleableComponent from './StyleableComponent';

const { ContactMethodV1, ProfileStatusV1 } = services.profile.containers;

const styles = {
    section: {
        marginTop: 20,
    },
};

class ProfileDetail extends StyleableComponent {

    static propTypes = {
        extendedProfile: PropTypes.object.isRequired,
        isLoggedInUser: PropTypes.bool.isRequired,
        onUpdateProfileCallback: PropTypes.func.isRequired,
        organization: PropTypes.instanceOf(services.organization.containers.OrganizationV1).isRequired,
    }

    static contextTypes = {
        router: PropTypes.shape({
            transitionTo: PropTypes.func.isRequired,
        }).isRequired,
    }

    // Update Methods

    _onUpdateStatus(statusText) {
        const {
            extendedProfile,
            onUpdateProfileCallback,
        } = this.props;

        let profileStatusV1 = new ProfileStatusV1({
            value: statusText,
        });

        let updatedProfile = Object.assign({}, extendedProfile.profile, {
            status:  profileStatusV1,
        });

        onUpdateProfileCallback(updatedProfile);
    }

    // Render Methods

    _renderStatus(status, isEditable) {
        return (
            <ProfileDetailStatus
                isEditable={isEditable}
                onSaveCallback={this._onUpdateStatus.bind(this)}
                status={status}
                style={this.mergeAndPrefix(styles.section)}
            />
        );
    }

    _renderContactInfo(contactMethods=[], locations=[]) {
        return (
            <ProfileDetailContactInfo
                contactMethods={contactMethods}
                locations={locations}
                onClickLocation={routeToLocation.bind(null, this.context.router)}
                style={this.mergeAndPrefix(styles.section)}
            />
        );
    }

    _renderTeam(manager, peers, team) {
        if (team) {
            return (
                <ProfileDetailTeam
                    style={this.mergeAndPrefix(styles.section)}
                    manager={manager}
                    peers={peers}
                    team={team}
                    onClickManager={routeToProfile.bind(null, this.context.router, manager)}
                    onClickTeam={routeToTeam.bind(null, this.context.router, team)}
                    onClickPeer={routeToProfile.bind(null, this.context.router)}
                />
            );
        }
    }

    _renderManages(team, directReports) {
        if (team) {
            return (
                <ProfileDetailManages
                    style={this.mergeAndPrefix(styles.section)}
                    team={team}
                    directReports={directReports}
                    onClickTeam={routeToTeam.bind(null, this.context.router, team)}
                    onClickDirectReport={routeToProfile.bind(null, this.context.router)}
                />
            );
        }
    }

    _getContactMethods() {
        const { profile } = this.props.extendedProfile;
        let contactMethods = [new ContactMethodV1({
            label: 'Email',
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

        const {
            organization,
            isLoggedInUser,
        } = this.props;

        return (
            <div>
                <ProfileDetailHeader
                    location={locations[0]}
                    organization={organization}
                    profile={profile}
                    team={team}
                />
                <DetailContent>
                    {this._renderStatus(profile.status, isLoggedInUser)}
                    {this._renderContactInfo(this._getContactMethods(), locations)}
                    {this._renderTeam(manager, peers, team)}
                    {this._renderManages(manages_team, direct_reports)}
                </DetailContent>
            </div>
        );
    }

}

export default ProfileDetail;
