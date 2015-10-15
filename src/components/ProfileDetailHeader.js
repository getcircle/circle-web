import { FlatButton } from 'material-ui';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { fontColors, fontWeights } from '../constants/styles';
import moment from '../utils/moment';
import t from '../utils/gettext';

import CSSComponent from './CSSComponent';
import DetailHeader from './DetailHeader';
import ProfileAvatar from './ProfileAvatar';

class ProfileDetailHeader extends CSSComponent {

    static propTypes = {
        isEditable: PropTypes.bool.isRequired,
        largerDevice: PropTypes.bool.isRequired,
        onEditTapped: PropTypes.func,
        organization: PropTypes.instanceOf(services.organization.containers.OrganizationV1).isRequired,
        profile: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
    }

    static contextTypes = {
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
            <div className="row end-xs" is="editButtonContainer">
                <FlatButton
                    is="editButton"
                    label={t('Edit Profile')}
                    onTouchTap={() => {
                        this.props.onEditTapped();
                    }}
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
            organization,
            profile,
        } = this.props;

        var tenureText;
        if (moment(profile.hire_date).isAfter(moment().subtract(7, 'days'))) {
            tenureText = "\u2B50 New at " + organization.name + ". Say hi!";
        }
        else {
            tenureText = "\u2014 at " + organization.name + " for " + moment(profile.hire_date).fromNow(true);
        }

        return (
            <DetailHeader
                img={this.getImageUrl()}
                largerDevice={this.props.largerDevice}
            >
                {this.renderEditButton()}
                <div className="row center-xs" is="avatarSection">
                    <ProfileAvatar is="avatar" profile={profile} />
                </div>
                <div className="row center-xs" is="nameSection">
                    <span style={this.context.muiTheme.commonStyles.headerPrimaryText}>
                        {profile.full_name}
                    </span>
                </div>
                <div className="row center-xs" is="titleSection">
                    <span style={this.context.muiTheme.commonStyles.headerSecondaryText}>
                        {profile.display_title}
                    </span>
                </div>
                <div className="row center-xs" is="tenureSection">
                    <span style={this.context.muiTheme.commonStyles.headerTertiaryText}>
                        {tenureText}
                    </span>
                </div>
            </DetailHeader>
        );
    }

}

export default ProfileDetailHeader;
