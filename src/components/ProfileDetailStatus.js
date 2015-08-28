import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import t from '../utils/gettext';

import TextValue from './TextValue';
import StyleableComponent from './StyleableComponent';

const styles = {

}

class ProfileDetailStatus extends StyleableComponent {

    static propTypes = {
        isEditable: PropTypes.bool,
        onSaveCallback: PropTypes.func.isRequired,
        status: PropTypes.instanceOf(services.profile.containers.ProfileStatusV1),
        style: PropTypes.object,
    }

    render() {
        const {
            isEditable,
            onSaveCallback,
            status,
            style,
        } = this.props;

        return (
            <TextValue
                editedTimestamp={status ? status.created : ''}
                isEditable={isEditable}
                onSaveCallback={onSaveCallback}
                placeholder={t('I\'m working on #project with @mypeer!')}
                shouldLimitCharacters={true}
                style={this.mergeAndPrefix(styles, style)}
                text={status ? status.value : ''}
                title={t('Currently Working On')}
            />
        );
    }
}

export default ProfileDetailStatus;
