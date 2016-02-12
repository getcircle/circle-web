import React from 'react';

import CSSComponent from './CSSComponent';
import AutoComplete from './AutoComplete';

class HeaderSearch extends CSSComponent {

    classes() {
        return {
            default: {
                SearchComponent: {
                    inputContainerStyle: {
                        border: '1px solid rgba(0, 0, 0, 0.2)',
                    },
                    listContainerStyle: {
                        position: 'absolute',
                    },
                    style: {
                        alignSelf: 'center',
                        justifyContent: 'center',
                        flex: 1,
                        position: 'relative',
                    },
                },
            },
        }
    }

    render() {
        return (
            <AutoComplete
                {...this.styles().SearchComponent}
                {...this.props}
            />
        );
    }
}

export default HeaderSearch;
