import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import t from '../utils/gettext';

import TextValue from './TextValue';
import StyleableComponent from './StyleableComponent';

const styles = {

}

class TeamDetailDescription extends StyleableComponent {

    static propTypes = {
        description: PropTypes.instanceOf(services.common.containers.DescriptionV1),
        isEditable: PropTypes.bool,
        onSaveCallback: PropTypes.func.isRequired,
        style: PropTypes.object,
    }

    render() {
        const {
            isEditable,
            onSaveCallback,
            description,
            style,
        } = this.props;

        let authorName = description && description.by_profile ? description.by_profile.full_name : ''
        return (
            <TextValue
                authorName={authorName}
                editedTimestamp={description ? description.changed : ''}
                isEditable={isEditable}
                onSaveCallback={onSaveCallback}
                placeholder={t('Add your team description here. Its best to add your team\'s mission statement or high level goals, and how your team impacts the business.')}
                shouldLimitCharacters={false}
                style={this.mergeAndPrefix(styles, style)}
                text={description ? description.value : ''}
                title={t('Description')}
            />
        );
    }
}

export default TeamDetailDescription;
