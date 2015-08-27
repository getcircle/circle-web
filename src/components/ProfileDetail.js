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

    onUpdateStatus(statusText) {
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

    renderStatus(status, isEditable) {
        return (
            <ProfileDetailStatus
                isEditable={isEditable}
                onSaveCallback={this.onUpdateStatus.bind(this)}
                status={status}
                style={this.mergeAndPrefix(styles.section)}
            />
        );
    }

    renderContactInfo(contactMethods=[], locations=[]) {
        return (
            <ProfileDetailContactInfo
                contactMethods={contactMethods}
                locations={locations}
                onClickLocation={routeToLocation.bind(null, this.context.router)}
                style={this.mergeAndPrefix(styles.section)}
            />
        );
    }

    renderTeam(manager, peers, team) {
        if (team) {
            return (
                <ProfileDetailTeam
                    manager={manager}
                    onClickManager={routeToProfile.bind(null, this.context.router, manager)}
                    onClickPeer={routeToProfile.bind(null, this.context.router)}
                    onClickTeam={routeToTeam.bind(null, this.context.router, team)}
                    peers={peers}
                    style={this.mergeAndPrefix(styles.section)}
                    team={team}
                />
            );
        }
    }

    renderManages(team, directReports) {
        if (team) {
            return (
                <ProfileDetailManages
                    directReports={directReports}
                    onClickDirectReport={routeToProfile.bind(null, this.context.router)}
                    onClickTeam={routeToTeam.bind(null, this.context.router, team)}
                    style={this.mergeAndPrefix(styles.section)}
                    team={team}
                />
            );
        }
    }

    getContactMethods() {
        const { profile } = this.props.extendedProfile;
        let contactMethods = [new ContactMethodV1({
            label: 'Email',
            value: profile.email,
            /*eslint-disable camelcase*/
            contact_method_type: ContactMethodV1.ContactMethodTypeV1.EMAIL,
            /*eslint-enable camelcase*/
        })];
        return contactMethods.concat(profile.contact_methods);
    }

    render() {
        const {
            /*eslint-disable camelcase*/
            direct_reports,
            locations,
            manager,
            manages_team,
            peers,
            profile,
            team,
            /*eslint-enable camelcase*/
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
                    {this.renderStatus(profile.status, isLoggedInUser)}
                    {this.renderContactInfo(this.getContactMethods(), locations)}
                    {this.renderTeam(manager, peers, team)}
                    {this.renderManages(manages_team, direct_reports)}
                </DetailContent>
            </div>
        );
    }

}

export default ProfileDetail;
