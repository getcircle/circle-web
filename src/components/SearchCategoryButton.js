import mui from 'material-ui';
import React from 'react';

const { FlatButton } = mui;

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

class SearchCategoryButton extends React.Component {

    static propTypes = {
        label: React.PropTypes.string.isRequired,
        active: React.PropTypes.bool,
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
                    style={buttonStyle}
                    labelStyle={styles.labelStyle}
                    rippleColor='white'
                    {...other}
                />
            </div>
        );
    }

}

export default SearchCategoryButton;
