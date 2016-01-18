import { Tabs, Tab } from 'material-ui';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import CurrentTheme from '../utils/ThemeManager';
import { PostStateURLString } from '../utils/post';
import { replaceProfileSlug } from '../utils/routes';
import t from '../utils/gettext';

import CSSComponent from './CSSComponent';
import DetailContent from './DetailContent';
import InternalPropTypes from './InternalPropTypes';
import Posts from './Posts';
import ProfileDetailAbout from './ProfileDetailAbout';
import ProfileDetailForm from './ProfileDetailForm';
import ProfileDetailHeader from './ProfileDetailHeader';

const { ContactMethodV1 } = services.profile.containers;

class ProfileDetail extends CSSComponent {

    static propTypes = {
        extendedProfile: PropTypes.object.isRequired,
        isLoggedInUser: PropTypes.bool.isRequired,
        onUpdateProfile: PropTypes.func.isRequired,
        posts: PropTypes.arrayOf(
            InternalPropTypes.PostV1
        ),
        postsLoadMore: PropTypes.func.isRequired,
        slug: PropTypes.string,
    }

    static defaultProps = {
        posts: [],
    };

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
        selectedTabValue: null,
    }

    getChildContext() {
        return {
            muiTheme: this.state.muiTheme,
        };
    }

    componentWillMount() {
        this.customizeTheme(this.props);
        this.mergeStateAndProps(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.customizeTheme(nextProps);
        this.mergeStateAndProps(nextProps);
    }

    classes() {
        return {
            default: {
                DetailContent: {
                    style: {
                        paddingTop: 40,
                    },
                },
                tabsContainer: {
                    margin: '0 auto',
                    padding: '0 25px',
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
                    fontWeight: '700',
                },
            },
        };
    }

    mergeStateAndProps(props) {
        if (!this.state.selectedTabValue) {
            this.setState({
                selectedTabValue: props.slug,
            });
        }
    }

    customizeTheme(props) {
        let customTheme = Object.assign({}, CurrentTheme, {
            tabs: {
                backgroundColor: 'transparent',
                textColor: 'rgba(255, 255, 255, 0.5)',
                selectedTextColor: 'rgb(255, 255, 255)',
            },
        });

        this.setState({muiTheme: customTheme});
    }

    // Handlers

    onTabChange(value, event, tab) {
        const {
            profile,
        } = this.props.extendedProfile;

        replaceProfileSlug(this.context.history, profile, value);
        this.setState({
            selectedTabValue: value,
        });
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

    // Render Methods

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
            extendedProfile,
            isLoggedInUser,
            postsLoadMore,
            onUpdateProfile,
            posts,
            slug,
        } = this.props;

        if (slug === 'knowledge') {
            return (
                <Posts
                    loading={false}
                    forProfile={extendedProfile.profile}
                    postState={PostStateURLString.LISTED}
                    posts={posts}
                    postsLoadMore={postsLoadMore}
                    showContent={true}
                    showEditDelete={false}
                />
            );
        } else {
            return (
                <ProfileDetailAbout
                    extendedProfile={extendedProfile}
                    isLoggedInUser={isLoggedInUser}
                    onUpdateProfile={onUpdateProfile}
                />
            );
        }
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
        const selectedTabValue = this.state.selectedTabValue ? this.state.selectedTabValue : 'knowledge';

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
                            valueLink={{value: selectedTabValue, requestChange: this.onTabChange.bind(this)}}
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
