import React from 'react';

import t from '../utils/gettext';

import AutoComplete from './AutoComplete';

const HomeSearch = (props) => {
    const styles = {
        inputContainer: {
            border: '1px solid rgba(0, 0, 0, 0.2)',
        }
    };
    return (
        <AutoComplete
            inputContainerStyle={styles.inputContainer}
            placeholder={t('Search your coworker\'s knowledge')}
            searchContainerWidth={660}
            {...props}
        />
    );
};

export default HomeSearch;
