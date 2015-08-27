import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import t from '../utils/gettext';

import TextValue from './TextValue';
import StyleableComponent from './StyleableComponent';

const styles = {

}

class TeamDetailStatus extends StyleableComponent {

    static propTypes = {
        isEditable: PropTypes.bool,
        onSaveCallback: PropTypes.func.isRequired,
        status: PropTypes.instanceOf(services.organization.containers.TeamStatusV1),
        style: PropTypes.object,
    }

    render() {
        const {
            isEditable,
            onSaveCallback,
            status,
            style,
        } = this.props;

        let authorName = status ? status.by_profile.full_name : ''
        return (
            <TextValue
                authorName={authorName}
                editedTimestamp={status ? status.created : ''}
                isEditable={isEditable}
                onSaveCallback={onSaveCallback}
                shouldLimitCharacters={true}
                style={this.mergeAndPrefix(styles, style)}
                text={status ? status.value : ''}
                title={t('Currently Working On')}
            />
        );
    }
}

export default TeamDetailStatus;
