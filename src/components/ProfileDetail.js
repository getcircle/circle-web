import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import {
    routeToProfile,
    routeToLocation,
    routeToTeam,
} from '../utils/routes';
import t from '../utils/gettext';

import DetailContent from './DetailContent';
import ProfileDetailContactInfo from './ProfileDetailContactInfo';
import ProfileDetailForm from './ProfileDetailForm';
import ProfileDetailHeader from './ProfileDetailHeader';
import ProfileDetailManages from './ProfileDetailManages';
import ProfileDetailTeam from './ProfileDetailTeam';
import StyleableComponent from './StyleableComponent';

const { ContactMethodV1 } = services.profile.containers;

const styles = {
    section: {
        marginTop: 20,
    },
};

class ProfileDetail extends StyleableComponent {

    static propTypes = {
        extendedProfile: PropTypes.object.isRequired,
        isAdminUser: PropTypes.bool.isRequired,
        isLoggedInUser: PropTypes.bool.isRequired,
        largerDevice: PropTypes.bool.isRequired,
        onUpdateProfile: PropTypes.func.isRequired,
        organization: PropTypes.instanceOf(services.organization.containers.OrganizationV1).isRequired,
    }

    static contextTypes = {
        history: PropTypes.shape({
            pushState: PropTypes.func.isRequired,
        }).isRequired,
    }

    // Render Methods

    renderContactInfo(contactMethods=[], locations=[], isLoggedInUser = false) {
        return (
            <ProfileDetailContactInfo
                contactMethods={contactMethods}
                isLoggedInUser={isLoggedInUser}
                largerDevice={this.props.largerDevice}
                locations={locations}
                onClickLocation={routeToLocation.bind(null, this.context.history)}
                profile={this.props.extendedProfile.profile}
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
                    onClickManager={routeToProfile.bind(null, this.context.history, manager)}
                    onClickPeer={routeToProfile.bind(null, this.context.history)}
                    onClickTeam={routeToTeam.bind(null, this.context.history, team)}
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
                    onClickDirectReport={routeToProfile.bind(null, this.context.history)}
                    onClickTeam={routeToTeam.bind(null, this.context.history, team)}
                    style={this.mergeAndPrefix(styles.section)}
                    team={team}
                />
            );
        }
    }

    editButtonTapped() {
        this.refs.profileDetailForm.getWrappedInstance().show();
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

    renderProfileDetailForm(profile, manager) {
        const {
            isAdminUser,
            isLoggedInUser,
            largerDevice,
            onUpdateProfile,
        } = this.props;

        if (isLoggedInUser || isAdminUser) {
            return (
                <ProfileDetailForm
                    contactMethods={this.getContactMethods()}
                    largerDevice={largerDevice}
                    manager={manager}
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
            isAdminUser,
            isLoggedInUser,
            organization,
        } = this.props;

        return (
            <div>
                <ProfileDetailHeader
                    isEditable={isLoggedInUser || isAdminUser}
                    largerDevice={this.props.largerDevice}
                    onEditTapped={this.editButtonTapped.bind(this)}
                    organization={organization}
                    profile={profile}
                />
                <DetailContent>
                    {this.renderContactInfo(this.getContactMethods(), locations, isLoggedInUser)}
                    {this.renderTeam(manager, peers, team)}
                    {this.renderManages(manages_team, direct_reports)}
                </DetailContent>
                {this.renderProfileDetailForm(profile, manager)}
            </div>
        );
    }

}

export default ProfileDetail;
