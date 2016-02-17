import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import {
    routeToProfile,
    routeToLocation,
    routeToTeam,
} from '../utils/routes';
import t from '../utils/gettext';

import CSSComponent from './CSSComponent';
import InternalPropTypes from './InternalPropTypes';
import ProfileDetailContactInfo from './ProfileDetailContactInfo';
import ProfileDetailManages from './ProfileDetailManages';
import ProfileDetailTeam from './ProfileDetailTeam';

const { ContactMethodV1 } = services.profile.containers;

class ProfileDetailAbout extends CSSComponent {

    static propTypes = {
        extendedProfile: PropTypes.object.isRequired,
        isLoggedInUser: PropTypes.bool.isRequired,
        onUpdateProfile: PropTypes.func.isRequired,
    }

    static contextTypes = {
        auth: InternalPropTypes.AuthContext.isRequired,
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
                onClickLocation={routeToLocation}
                profile={this.props.extendedProfile.profile}
            />
        );
    }

    renderTeam(manager, peers, team) {
        if (team) {
            return (
                <ProfileDetailTeam
                    manager={manager}
                    onClickManager={routeToProfile.bind(null, manager)}
                    onClickPeer={routeToProfile}
                    onClickTeam={routeToTeam.bind(null, team)}
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
                    onClickDirectReport={routeToProfile}
                    onClickTeam={routeToTeam.bind(null, team)}
                    style={this.styles().section}
                    team={team}
                />
            );
        }
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

    render() {
        const {
            /*eslint-disable camelcase*/
            direct_reports,
            locations,
            manager,
            manages_team,
            peers,
            team,
            /*eslint-enable camelcase*/
        } = this.props.extendedProfile;

        const {
            isLoggedInUser,
        } = this.props;

        return (
            <div>
                {this.renderContactInfo(this.getContactMethods(), locations, isLoggedInUser)}
                {this.renderTeam(manager, peers, team)}
                {this.renderManages(manages_team, direct_reports)}
            </div>
        );
    }
}

export default ProfileDetailAbout;
