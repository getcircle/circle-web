import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import {
    routeToProfile,
    routeToLocation,
    routeToTeam,
} from '../utils/routes';
import t from '../utils/gettext';

import CSSComponent from './CSSComponent';
import DetailContent from './DetailContent';
import InternalPropTypes from './InternalPropTypes';
import ProfileDetailContactInfo from './ProfileDetailContactInfo';
import ProfileDetailForm from './ProfileDetailForm';
import ProfileDetailHeader from './ProfileDetailHeader';
import ProfileDetailManages from './ProfileDetailManages';
import ProfileDetailTeam from './ProfileDetailTeam';

const { ContactMethodV1 } = services.profile.containers;

class ProfileDetail extends CSSComponent {

    static propTypes = {
        extendedProfile: PropTypes.object.isRequired,
        isLoggedInUser: PropTypes.bool.isRequired,
        onUpdateProfile: PropTypes.func.isRequired,
    }

    static contextTypes = {
        auth: InternalPropTypes.AuthContext.isRequired,
        history: PropTypes.shape({
            pushState: PropTypes.func.isRequired,
        }).isRequired,
    }

    classes() {
        return {
            default: {
                section: {
                    marginTop: 20,
                },
            },
        };
    }
    // Render Methods

    renderContactInfo(contactMethods=[], locations=[], isLoggedInUser = false) {
        return (
            <ProfileDetailContactInfo
                contactMethods={contactMethods}
                isLoggedInUser={isLoggedInUser}
                locations={locations}
                onClickLocation={routeToLocation.bind(null, this.context.history)}
                profile={this.props.extendedProfile.profile}
                style={this.styles().section}
            />
        );
    }

    renderTeam(manager, peers, team) {
        if (team) {
            return (
                <ProfileDetailTeam
                    manager={manager}
                    onClickManager={routeToProfile.bind(null, this.context.history, manager)}
                    onClickPeer={routeToProfile.bind(null, this.context.history)}
                    onClickTeam={routeToTeam.bind(null, this.context.history, team)}
                    peers={peers}
                    style={this.styles().section}
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
                    onClickDirectReport={routeToProfile.bind(null, this.context.history)}
                    onClickTeam={routeToTeam.bind(null, this.context.history, team)}
                    style={this.styles().section}
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
            isLoggedInUser,
            onUpdateProfile,
        } = this.props;
        const { profile: authenticatedProfile } = this.context.auth;

        if (isLoggedInUser || authenticatedProfile.is_admin) {
            return (
                <ProfileDetailForm
                    contactMethods={this.getContactMethods()}
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
            isLoggedInUser,
        } = this.props;
        const { profile: authenticatedProfile } = this.context.auth;

        return (
            <div>
                <ProfileDetailHeader
                    isEditable={isLoggedInUser || !!authenticatedProfile.is_admin}
                    onEditTapped={this.editButtonTapped.bind(this)}
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
