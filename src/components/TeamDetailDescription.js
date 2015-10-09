import mui from 'material-ui';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { mailtoTeamDescription } from '../utils/contact';
import t from '../utils/gettext';

import TextValue from './TextValue';
import CSSComponent from './CSSComponent';

const { FlatButton } = mui;

class TeamDetailDescription extends CSSComponent {

    static propTypes = {
        description: PropTypes.instanceOf(services.common.containers.DescriptionV1),
        isEditable: PropTypes.bool,
        manager: PropTypes.instanceOf(services.common.containers.ProfileV1),
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
        if (manager.id !== this.context.authenticatedProfile.id) {
            defaultContent = (
                <FlatButton
                    href={mailtoTeamDescription(team, manager, this.context.authenticatedProfile)}
                    is="link"
                    linkButton={true}
                    primary={true}
                    target="_blank"
                >
                    {t('Ask Me!')}
                </FlatButton>
            );
        }

        return (
            <TextValue
                defaultContent={defaultContent}
                isEditable={isEditable}
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
