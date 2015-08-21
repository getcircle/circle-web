import { FlatButton } from 'material-ui';
import React, { PropTypes } from 'react';

import StyleableComponent from './StyleableComponent';

const styles = {
    button: {
        backgroundColor: '#3984C3',
        marginTop: 5,
    },
    labelStyle: {
        color: 'white',
        fontWeight: 'bold',
    },
};

class SearchCategoryToken extends StyleableComponent {

    static propTypes = {
        label: PropTypes.string.isRequired,
    }

    render() {
        return (
            <FlatButton
                labelStyle={styles.labelStyle}
                style={styles.button}
                {...this.props}
            />
        );
    }
}

export default SearchCategoryToken;
