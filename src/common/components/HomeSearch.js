import React from 'react';

import t from '../utils/gettext';

import CSSComponent from './CSSComponent';
import InternalPropTypes from './InternalPropTypes';
import QuickSearch from './QuickSearch';

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

    handleFocus() {
        this.setState({focused: true});
    }

    render() {
        return (
            <QuickSearch
                onFocus={::this.handleFocus}
                placeholder={t('Search your coworker\'s knowledge')}
                searchContainerWidth={660}
                {...this.styles().SearchComponent}
                {...this.props}
            />
        );
    }

}

export default HomeSearch;
