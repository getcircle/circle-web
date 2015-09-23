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
        onEditTapped: PropTypes.func,
        organization: PropTypes.instanceOf(services.organization.containers.OrganizationV1).isRequired,
        profile: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
        team: PropTypes.instanceOf(services.organization.containers.TeamV1),
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
                },
                editButton: {
                    backgroundColor: 'transparent',
                    border: '1px solid white',
                    margin: '16px 16px 0 16px',
                    fontSize: 11,
                    letterSpacing: '1px',
                    ...fontColors.white,
                    ...fontWeights.semiBold,
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
                    paddingTop: '6vh',
                },
            }
        }
    }

    renderEditButton() {
        console.log('COMING HERE');
        const {
            isEditable,
        } = this.props;

        if (!isEditable) {
            return;
        }

        return (
            <div is="editButtonContainer">
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

    render() {
        const {
            organization,
            profile,
            team,
        } = this.props;
        return (
            <DetailHeader img={profile.image_url}>
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
                        {profile.title} {team && team.name ? `(${team.name})` : ''}
                    </span>
                </div>
                <div className="row center-xs" is="tenureSection">
                    <span style={this.context.muiTheme.commonStyles.headerTertiaryText}>
                        {`\u2014 at ${organization.name} for ${moment(profile.hire_date).fromNow(true)}`}
                    </span>
                </div>
            </DetailHeader>
        );
    }

}

export default ProfileDetailHeader;
