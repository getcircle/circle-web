import { FlatButton } from 'material-ui';
import React, { PropTypes } from 'react';

import StyleableComponent from './StyleableComponent';

const styles = {
    button: {
        width: 116,
        opacity: '20%',
        backgroundColor: 'transparent',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        textAlign: 'center',
    },
    container: {
        paddingTop: 10,
    },
    labelStyle: {
        color: 'white',
        fontWeight: 'bold',
    },
};

class SearchCategoryButton extends StyleableComponent {

    static propTypes = {
        active: PropTypes.bool,
        className: PropTypes.string,
        label: PropTypes.string.isRequired,
    }

    render() {
        const {
            active,
            className,
            ...other
        } = this.props;

        let buttonStyle = Object.assign({}, styles.button);
        if (active !== undefined && active) {
            buttonStyle.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        }
        return (
            <div className={className} style={styles.container}>
                <FlatButton
                    labelStyle={styles.labelStyle}
                    rippleColor='white'
                    style={buttonStyle}
                    {...other}
                />
            </div>
        );
    }

}

export default SearchCategoryButton;
