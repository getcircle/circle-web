import mui from 'material-ui';
import React from 'react';

const { FlatButton } = mui;

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

class SearchCategoryToken extends React.Component {

    static propTypes = {
        label: React.PropTypes.string.isRequired,
    }

    render() {
        return (
            <FlatButton
                style={styles.button}
                labelStyle={styles.labelStyle}
                {...this.props}
            />
        );
    }
}

export default SearchCategoryToken;
