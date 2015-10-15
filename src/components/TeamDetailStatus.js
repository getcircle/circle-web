import mui from 'material-ui';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { CONTACT_LOCATION } from '../constants/trackerProperties';
import { mailtoTeamStatus } from '../utils/contact';
import t from '../utils/gettext';
import tracker from '../utils/tracker';

import TextValue from './TextValue';
import CSSComponent from './CSSComponent';

const { FlatButton } = mui;
const { ContactMethodTypeV1 } = services.profile.containers.ContactMethodV1;

class TeamDetailStatus extends CSSComponent {

    static propTypes = {
        isEditable: PropTypes.bool,
        manager: PropTypes.instanceOf(services.profile.containers.ProfileV1),
        onSaveCallback: PropTypes.func.isRequired,
        status: PropTypes.instanceOf(services.organization.containers.TeamStatusV1),
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
            isEditable,
            manager,
            onSaveCallback,
            status,
            style,
            team,
        } = this.props;

        let authorName = status ? status.by_profile.full_name : '';

        let defaultContent;
        if (!isEditable) {
            defaultContent = (
                <FlatButton
                    href={mailtoTeamStatus(team, manager, this.context.authenticatedProfile)}
                    is="link"
                    linkButton={true}
                    onTouchTap={() => {
                        tracker.trackContactTap(
                            ContactMethodTypeV1.EMAIL,
                            manager,
                            CONTACT_LOCATION.TEAM_DETAIL_STATUS
                        );
                    }}
                    primary={true}
                    target="_blank"
                >
                    {t('Ask Me!')}
                </FlatButton>
            );
        }

        return (
            <TextValue
                authorName={authorName}
                defaultContent={defaultContent}
                editedTimestamp={status ? status.changed : ''}
                isEditable={isEditable}
                isQuoted={!isEditable}
                onSaveCallback={onSaveCallback}
                placeholder={t('What #projects is your team working on?')}
                shouldLimitCharacters={true}
                style={style}
                text={status ? status.value : ''}
                title={t('Currently Working On')}
            />
        );
    }
}

export default TeamDetailStatus;
