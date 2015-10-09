import mui from 'material-ui';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { mailtoProfileStatus } from '../utils/contact';
import t from '../utils/gettext';

import TextValue from './TextValue';
import CSSComponent from './CSSComponent';

const { FlatButton } = mui;

class ProfileDetailStatus extends CSSComponent {

    static propTypes = {
        isEditable: PropTypes.bool,
        onSaveCallback: PropTypes.func.isRequired,
        profile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
        status: PropTypes.instanceOf(services.profile.containers.ProfileStatusV1),
        style: PropTypes.object,
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
            onSaveCallback,
            profile,
            status,
            style,
        } = this.props;

        let defaultContent;
        if (!isEditable) {
            defaultContent = (
                <FlatButton
                    href={mailtoProfileStatus(profile, this.context.authenticatedProfile)}
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
                editedTimestamp={status && status.value.trim() !== '' ? status.created : ''}
                isEditable={isEditable}
                isQuoted={!isEditable}
                onSaveCallback={onSaveCallback}
                placeholder={t('working on #project with @coworkers!')}
                shouldLimitCharacters={true}
                style={style}
                text={status ? status.value : ''}
                title={t('Currently Working On')}
            />
        );
    }
}

export default ProfileDetailStatus;
