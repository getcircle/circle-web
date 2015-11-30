import mui from 'material-ui';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { CONTACT_LOCATION } from '../constants/trackerProperties';
import { mailtoTeamDescription } from '../utils/contact';
import t from '../utils/gettext';
import tracker from '../utils/tracker';

import TextValue from './TextValue';
import CSSComponent from './CSSComponent';

const { FlatButton } = mui;
const { ContactMethodTypeV1 } = services.profile.containers.ContactMethodV1;

class TeamDetailDescription extends CSSComponent {

    static propTypes = {
        description: PropTypes.instanceOf(services.common.containers.description.DescriptionV1),
        isEditable: PropTypes.bool,
        manager: PropTypes.instanceOf(services.profile.containers.ProfileV1),
        onEditTapped: PropTypes.func,
        onSaveCallback: PropTypes.func.isRequired,
        style: PropTypes.object,
        team: PropTypes.instanceOf(services.organization.containers.TeamV1),
    }

    static contextTypes = {
        authenticatedProfile: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
    }

    classes() {
        return {
            default: {
                link: {
                    textAlign: 'center',
                    textTransform: 'none',
                },
            },
        };
    }

    render() {
        const {
            description,
            isEditable,
            onSaveCallback,
            manager,
            style,
            team,
        } = this.props;

        let defaultContent;
        if (!isEditable) {
            defaultContent = (
                <FlatButton
                    href={mailtoTeamDescription(team, manager, this.context.authenticatedProfile)}
                    linkButton={true}
                    onTouchTap={() => {
                        tracker.trackContactTap(
                            ContactMethodTypeV1.EMAIL,
                            manager,
                            CONTACT_LOCATION.TEAM_DETAIL_DESCRIPTION
                        );
                    }}
                    primary={true}
                    style={this.styles().link}
                    target="_blank"
                >
                    {t('Ask Me!')}
                </FlatButton>
            );
        } else if (this.props.onEditTapped) {
            defaultContent = (
                <FlatButton
                    onTouchTap={() => this.props.onEditTapped()}
                    primary={true}
                    style={this.styles().link}
                >
                    {t('Add details')}
                </FlatButton>
            );
        }

        return (
            <TextValue
                defaultContent={defaultContent}
                // Descriptions are editable from the form
                // This property is still useful to control Ask Me links.
                isEditable={false}
                onSaveCallback={onSaveCallback}
                placeholder={t('Add your team description here. Its best to add your team\'s mission statement or high level goals, and how your team impacts the business.')}
                shouldLimitCharacters={false}
                style={style}
                text={description ? description.value : ''}
                title={t('Description')}
            />
        );
    }
}

export default TeamDetailDescription;
