import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import t from '../utils/gettext';

import TextValue from './TextValue';
import StyleableComponent from './StyleableComponent';

const styles = {

}

class LocationDetailDescription extends StyleableComponent {

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

        let authorName = description ? description.by_profile.full_name : ''
        return (
            <TextValue
                authorName={authorName}
                editedTimestamp={description ? description.changed : ''}
                isEditable={isEditable}
                onSaveCallback={onSaveCallback}
                placeholder={t('Add a description on your location. You can add unique things about the office, what teams work there, and local info about the office.')}
                shouldLimitCharacters={false}
                style={this.mergeAndPrefix(styles, style)}
                text={description ? description.value : ''}
                title={t('Description')}
            />
        );
    }
}

export default LocationDetailDescription;
