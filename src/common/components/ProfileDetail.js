import mui from 'material-ui';
import { Tabs, Tab } from 'material-ui';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import CurrentTheme from '../utils/ThemeManager';
import { fontWeights } from '../constants/styles';
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

    static childContextTypes = {
        muiTheme: PropTypes.object,
    }

    state = {
        muiTheme: CurrentTheme,
    }

    getChildContext() {
        return {
            muiTheme: this.state.muiTheme,
        };
    }

    componentWillMount() {
        this.customizeTheme(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.customizeTheme(nextProps);
    }

    classes() {
        return {
            default: {
                DetailContent: {
                    style: {
                        paddingTop: 20,
                    },
                },
                section: {
                    marginTop: 20,
                },
                tabsContainer: {
                    margin: '0 auto',
                    width: '800px',
                },
                tabsSection: {
                    backgroundColor: 'rgb(51, 51, 51)',
                    paddingBottom: '2px',
                    width: '100%',
                },
                tabInkBarStyle: {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    height: 1,
                    marginTop: '-8px',
                },
                tab: {
                    fontSize: 12,
                    letterSpacing: '1px',
                    padding: '0 15px',
                    textTransform: 'uppercase',
                    ...fontWeights.semiBold,
                },
            },
        };
    }

    customizeTheme(props) {
        let customTheme = Object.assign({}, CurrentTheme, {
            tabs: {
                backgroundColor: 'transparent',
                textColor: 'rgba(255, 255, 255, 0.7)',
                selectedTextColor: 'rgb(255, 255, 255)',
            },
        });

        this.setState({muiTheme: customTheme});
    }

    onTabChange(event) {

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

    renderContent() {
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

    render() {
        const {
            /*eslint-disable camelcase*/
            manager,
            profile,
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
                <div className="row" style={this.styles().tabsSection}>
                    <div className="row" style={this.styles().tabsContainer}>
                        <Tabs
                            inkBarStyle={{...this.styles().tabInkBarStyle}}
                            valueLink={{value: 'about', requestChange: this.onTabChange.bind(this)}}
                        >
                            <Tab
                                label={t('Knowledge')}
                                style={{...this.styles().tab}}
                                value="knowledge"
                            />
                            <Tab
                                label={t('About')}
                                style={{...this.styles().tab}}
                                value="about"
                            />
                        </Tabs>
                    </div>
                </div>
                <DetailContent {...this.styles().DetailContent}>
                    {this.renderContent()}
                </DetailContent>
                {this.renderProfileDetailForm(profile, manager)}
            </div>
        );
    }

}

export default ProfileDetail;
