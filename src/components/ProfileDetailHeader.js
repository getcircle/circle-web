import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { fontColors, fontWeights } from '../constants/styles';
import moment from '../utils/moment';

import CSSComponent from './CSSComponent';
import DetailHeader from './DetailHeader';
import ProfileAvatar from './ProfileAvatar';

class ProfileDetailHeader extends CSSComponent {

    static propTypes = {
        organization: PropTypes.instanceOf(services.organization.containers.OrganizationV1).isRequired,
        profile: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
        team: PropTypes.instanceOf(services.organization.containers.TeamV1),
    }

    classes() {
        return {
            default: {
                avatar: {
                    height: 120,
                    width: 120,
                    fontSize: '48px',
                },
                avatarSection: {
                    paddingTop: '5vh',
                },
                name: {
                    fontSize: '36px',
                    lineHeight: '49px',
                    ...fontColors.white,
                    ...fontWeights.light,
                },
                tenure: {
                    fontSize: '12px',
                    lineHeight: '18px',
                    ...fontColors.darkWhite,
                },
                tenureSection: {
                    paddingTop: 10,
                    paddingBottom: '5vh',
                },
                title: {
                    textTransform: 'uppercase',
                    fontSize: '12px',
                    lineHeight: '17px',
                    letterSpacing: '2px',
                    ...fontColors.white,
                    ...fontWeights.semiBold,
                },
                titleSection: {
                    paddingTop: 10,
                },
            }
        }
    }

    render() {
        const {
            organization,
            profile,
            team,
        } = this.props;
        return (
            <DetailHeader>
                <div className="row center-xs" is="avatarSection">
                    <ProfileAvatar is="avatar" profile={profile} />
                </div>
                <div className="row center-xs" is="nameSection">
                    <span is="name">{profile.full_name}</span>
                </div>
                <div className="row center-xs" is="titleSection">
                    <span is="title">
                        {profile.title} {team && team.name ? `(${team.name})` : ''}
                    </span>
                </div>
                <div className="row center-xs" is="tenureSection">
                    <span is="tenure">
                        {`\u2014 at ${organization.name} for ${moment(profile.hire_date).fromNow(true)}`}
                    </span>
                </div>
            </DetailHeader>
        );
    }

}

export default ProfileDetailHeader;
