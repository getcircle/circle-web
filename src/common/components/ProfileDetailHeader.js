import { FlatButton } from 'material-ui';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { fontColors, fontWeights } from '../constants/styles';
import moment from '../utils/moment';
import t from '../utils/gettext';

import CSSComponent from './CSSComponent';
import DetailHeader from './DetailHeader';
import InternalPropTypes from './InternalPropTypes';
import ProfileAvatar from './ProfileAvatar';

class ProfileDetailHeader extends CSSComponent {

    static propTypes = {
        isEditable: PropTypes.bool.isRequired,
        onEditTapped: PropTypes.func,
        profile: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
    }

    static contextTypes = {
        auth: InternalPropTypes.AuthContext.isRequired,
        muiTheme: PropTypes.object.isRequired,
    }

    classes() {
        return {
            default: {
                avatar: {
                    height: 120,
                    width: 120,
                    fontSize: '48px',
                },
                editButtonContainer: {
                    display: 'flex',
                    justifyContent: 'flex-end',
                    maxWidth: 800,
                    margin: '0 auto',
                    padding: '0 10px',
                },
                editButton: {
                    backgroundColor: 'transparent',
                    border: '1px solid white',
                    marginTop: '16px',
                    fontSize: 11,
                    letterSpacing: '1px',
                    ...fontColors.white,
                    ...fontWeights.semiBold,
                },
                nameSection: {
                    paddingTop: 5,
                },
                tenureSection: {
                    paddingTop: 10,
                    paddingBottom: '5vh',
                },
                titleSection: {
                    paddingTop: 10,
                },
            },
            'isEditable-false': {
                avatarSection: {
                    paddingTop: '60px',
                },
            }
        }
    }

    renderEditButton() {
        const {
            isEditable,
        } = this.props;

        if (!isEditable) {
            return;
        }

        return (
            <div className="row end-xs" style={this.styles().editButtonContainer}>
                <FlatButton
                    label={t('Edit Profile')}
                    onTouchTap={() => {
                        this.props.onEditTapped();
                    }}
                    style={this.styles().editButton}
                />
            </div>
        );

    }

    getImageUrl() {
        const { profile } = this.props;
        if (profile) {
            return profile.image_url;
        }
    }

    render() {
        const {
            profile,
        } = this.props;
        const { organization } = this.context.auth;

        let tenureText = '';
        if (profile.hire_date) {
            if (moment(profile.hire_date).isAfter(moment().subtract(7, 'days'))) {
                tenureText = t(`\u2B50 New at ${organization.name}. Say hi!`);
            } else {
                tenureText = t(`\u2014 at ${organization.name} for ${moment(profile.hire_date).fromNow(true)}`);
            }
        }

        return (
            <DetailHeader img={this.getImageUrl()}>
                {this.renderEditButton()}
                <div className="row center-xs" style={this.styles().avatarSection}>
                    <ProfileAvatar profile={profile} style={this.styles().avatar} />
                </div>
                <div className="row center-xs" style={this.styles().nameSection}>
                    <span style={this.context.muiTheme.commonStyles.headerPrimaryText}>
                        {profile.full_name}
                    </span>
                </div>
                <div className="row center-xs" style={this.styles().titleSection}>
                    <span style={this.context.muiTheme.commonStyles.headerSecondaryText}>
                        {profile.display_title}
                    </span>
                </div>
                <div className="row center-xs" style={this.styles().tenureSection}>
                    <span style={this.context.muiTheme.commonStyles.headerTertiaryText}>
                        {tenureText}
                    </span>
                </div>
            </DetailHeader>
        );
    }

}

export default ProfileDetailHeader;
