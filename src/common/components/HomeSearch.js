import React from 'react';

import t from '../utils/gettext';

import CSSComponent from './CSSComponent';
import InternalPropTypes from './InternalPropTypes';
import AutoComplete from './AutoComplete';

class HomeSearch extends CSSComponent {

    static contextTypes = {
        device: InternalPropTypes.DeviceContext.isRequired,
    }

    classes() {
        return {
            default: {
                SearchComponent: {
                    inputContainerStyle: {
                        border: '1px solid rgba(0, 0, 0, 0.2)',
                    },
                },
            },
        }
    }

    render() {
        return (
            <AutoComplete
                placeholder={t('Search your coworker\'s knowledge')}
                searchContainerWidth={660}
                {...this.styles().SearchComponent}
                {...this.props}
            />
        );
    }

}

export default HomeSearch;
