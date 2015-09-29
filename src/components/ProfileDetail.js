import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import {
    routeToProfile,
    routeToLocation,
    routeToTeam,
} from '../utils/routes';
import t from '../utils/gettext';
import tracker from '../utils/tracker';

import DetailContent from './DetailContent';
import ProfileDetailContactInfo from './ProfileDetailContactInfo';
import ProfileDetailForm from './ProfileDetailForm';
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
        largerDevice: PropTypes.bool.isRequired,
        onUpdateProfile: PropTypes.func.isRequired,
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
            onUpdateProfile,
        } = this.props;

        let profile = extendedProfile.profile;
        let profileStatusV1 = new ProfileStatusV1({
            value: statusText,
        });
        let updatedProfile = Object.assign({}, profile, {
            status:  profileStatusV1,
        });

        if ((profile.status && profile.status.value !== statusText) || !profile.status) {
            tracker.trackProfileUpdate(
                profile.id,
                ['status']
            );
        }
        onUpdateProfile(updatedProfile);
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

    renderContactInfo(contactMethods=[], locations=[], isLoggedInUser = false) {
        return (
            <ProfileDetailContactInfo
                contactMethods={contactMethods}
                isLoggedInUser={isLoggedInUser}
                largerDevice={this.props.largerDevice}
                locations={locations}
                onClickLocation={routeToLocation.bind(null, this.context.router)}
                profileId={this.props.extendedProfile.profile.id}
                style={this.mergeAndPrefix(styles.section)}
            />
        );
    }

    renderTeam(manager, peers, team) {
        if (team) {
            return (
                <ProfileDetailTeam
                    largerDevice={this.props.largerDevice}
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
                    largerDevice={this.props.largerDevice}
                    onClickDirectReport={routeToProfile.bind(null, this.context.router)}
                    onClickTeam={routeToTeam.bind(null, this.context.router, team)}
                    style={this.mergeAndPrefix(styles.section)}
                    team={team}
                />
            );
        }
    }

    editButtonTapped() {
        // XXX: Hack
        // ProfileDetailForm connects directly to the Redux store
        // For these kind of components, Redux creates a Connect wrapper
        // component and there are no good solutions to
        // access the original instance.
        this.refs.profileDetailForm.refs.wrappedInstance.show();
    }

    // Helpers

    getContactMethods() {
        const {
            isLoggedInUser,
            profile,
        } = this.props.extendedProfile;
        let contactMethods = [new ContactMethodV1({
            label: 'Email',
            value: profile.email,
            /*eslint-disable camelcase*/
            contact_method_type: ContactMethodV1.ContactMethodTypeV1.EMAIL,
            /*eslint-enable camelcase*/
        })];

        // Add placeholder for phone number too
        if (profile.contact_methods.length === 0) {
            contactMethods.push(
                new ContactMethodV1({
                    label: 'Cell',
                    value: isLoggedInUser ? t('Add number') : '',
                    /*eslint-disable camelcase*/
                    contact_method_type: ContactMethodV1.ContactMethodTypeV1.CELL_NUMBER,
                    /*eslint-enable camelcase*/
                })
            );
        }

        return contactMethods.concat(profile.contact_methods);
    }

    renderProfileDetailForm(profile) {
        const {
            isLoggedInUser,
            onUpdateProfile,
        } = this.props;

        if (isLoggedInUser) {
            return (
                <ProfileDetailForm
                    contactMethods={this.getContactMethods()}
                    onSaveCallback={onUpdateProfile}
                    profile={profile}
                    ref="profileDetailForm"
                />
            );
        }
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
                    isEditable={isLoggedInUser}
                    onEditTapped={this.editButtonTapped.bind(this)}
                    organization={organization}
                    profile={profile}
                    team={team}
                />
                <DetailContent>
                    {this.renderStatus(profile.status, isLoggedInUser)}
                    {this.renderContactInfo(this.getContactMethods(), locations, isLoggedInUser)}
                    {this.renderTeam(manager, peers, team)}
                    {this.renderManages(manages_team, direct_reports)}
                </DetailContent>
                {this.renderProfileDetailForm(profile)}
            </div>
        );
    }

}

export default ProfileDetail;
